import User from "../models/User.js";
import Module from "../models/Module.js";
import Quiz from "../models/Quiz.js";
import Progress from "../models/Progress.js";
import KnowledgeArticle from "../models/KnowledgeArticle.js";
import Feedback from "../models/Feedback.js";
import mongoose from "mongoose";
import {
  translateModuleData,
  translateQuizData,
} from "../services/translationService.js";

// ==========================================
// DASHBOARD STATS
// GET /api/admin/dashboard
// ==========================================
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalModules,
      totalQuizzes,
      totalFeedback,
      totalCompletions,
      totalKnowledge,
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Module.countDocuments(),
      Quiz.countDocuments(),
      Feedback.countDocuments(),
      Progress.countDocuments({ completed: true }),
      KnowledgeArticle.countDocuments(),
    ]);

    // Average quiz score
    const scoreAgg = await Progress.aggregate([
      { $match: { completed: true } },
      { $group: { _id: null, avgScore: { $avg: "$quizScore" } } },
    ]);
    const avgScore = scoreAgg.length > 0 ? Math.round(scoreAgg[0].avgScore) : 0;

    // Average feedback rating
    const ratingAgg = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    const avgRating = ratingAgg.length > 0 ? ratingAgg[0].avgRating.toFixed(1) : 0;

    // Recent registrations (last 5)
    const recentUsers = await User.find({ role: "student" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt level points")
      .lean();

    // Recent completions (last 5)
    const recentCompletions = await Progress.find({ completed: true })
      .sort({ completedAt: -1 })
      .limit(5)
      .populate("userId", "name email")
      .populate("moduleId", "title icon")
      .lean();

    // Recent feedback (last 5)
    const recentFeedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name")
      .populate("module", "title")
      .lean();

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalModules,
        totalQuizzes,
        totalFeedback,
        totalCompletions,
        totalKnowledge,
        avgScore,
        avgRating,
      },
      recentUsers,
      recentCompletions,
      recentFeedback,
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ==========================================
// USERS
// ==========================================

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("-password")
        .lean(),
      User.countDocuments(filter),
    ]);

    // Get completed module counts per user
    const userIds = users.map((u) => u._id);
    const completions = await Progress.aggregate([
      { $match: { userId: { $in: userIds }, completed: true } },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
    ]);
    const completionMap = completions.reduce((acc, c) => {
      acc[c._id.toString()] = c.count;
      return acc;
    }, {});

    const usersWithData = users.map((u) => ({
      ...u,
      completedModules: completionMap[u._id.toString()] || 0,
    }));

    return res.status(200).json({
      success: true,
      users: usersWithData,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// GET /api/admin/users/:id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID." });
    }

    const user = await User.findById(id).select("-password").lean();
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const progress = await Progress.find({ userId: id })
      .populate("moduleId", "title slug icon pointsReward")
      .lean();

    return res.status(200).json({ success: true, user, progress });
  } catch (error) {
    console.error("Error in getUserById:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["student", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID." });
    }

    // Prevent self-demotion
    if (id === req.user.userId) {
      return res.status(400).json({ success: false, message: "You cannot change your own role." });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ==========================================
// MODULES
// ==========================================

// Helper to extract clean YouTube video ID
const extractYouTubeId = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i,
    /^[a-zA-Z0-9_-]{11}$/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
};

// Validate and sanitize video list for storage
const validateAndCleanVideos = (videoList) => {
  if (!videoList || !Array.isArray(videoList)) return [];
  const cleaned = [];
  for (let i = 0; i < videoList.length; i++) {
    const v = videoList[i];
    if (!v) continue;
    const rawUrl = typeof v === "string" ? v : v.url;
    if (!rawUrl || !rawUrl.trim()) continue;
    const videoId = extractYouTubeId(rawUrl);
    if (!videoId) {
      throw new Error(`Video #${i + 1} has an invalid YouTube URL: "${rawUrl}". Supported formats: youtu.be, youtube.com/watch?v=..., or youtube.com/embed/...`);
    }
    cleaned.push({
      _id: v._id || undefined,
      title: (v.title && typeof v.title === "string" && v.title.trim()) || "Module Video",
      url: `https://www.youtube.com/watch?v=${videoId}`,
    });
  }
  return cleaned;
};

// GET /api/admin/modules
export const adminGetModules = async (req, res) => {
  try {
    const modules = await Module.find().sort({ order: 1 }).lean();
    return res.status(200).json({ success: true, modules });
  } catch (error) {
    console.error("Error in adminGetModules:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// POST /api/admin/modules
export const adminCreateModule = async (req, res) => {
  try {
    const { title, slug, description, icon, content, order, pointsReward, requiredLevel, videoUrls } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ success: false, message: "Title and slug are required." });
    }

    const existing = await Module.findOne({ slug: slug.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "A module with this slug already exists." });
    }

    let cleanedVideos = [];
    if (videoUrls) {
      try {
        cleanedVideos = validateAndCleanVideos(videoUrls);
      } catch (validationErr) {
        return res.status(400).json({ success: false, message: validationErr.message });
      }
    }

    let translations = {};
    try {
      translations = await translateModuleData({
        title: title.trim(),
        description: description?.trim() || "",
        content: content || "",
      });
    } catch (tErr) {
      console.warn("Translation failed during adminCreateModule:", tErr.message);
    }

    const module = await Module.create({
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      description: description?.trim(),
      icon,
      content,
      order: order || 0,
      pointsReward: pointsReward || 50,
      requiredLevel: requiredLevel || 1,
      videoUrls: cleanedVideos,
      translations,
    });

    return res.status(201).json({ success: true, module });
  } catch (error) {
    console.error("Error in adminCreateModule:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// PUT /api/admin/modules/:id
export const adminUpdateModule = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid module ID." });
    }

    const { title, slug, description, icon, content, order, pointsReward, requiredLevel, videoUrls } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (slug !== undefined) updateData.slug = slug.trim().toLowerCase();
    if (description !== undefined) updateData.description = description?.trim();
    if (icon !== undefined) updateData.icon = icon;
    if (content !== undefined) updateData.content = content;
    if (order !== undefined) updateData.order = order;
    if (pointsReward !== undefined) updateData.pointsReward = pointsReward;
    if (requiredLevel !== undefined) updateData.requiredLevel = requiredLevel;

    // Only update videoUrls if explicitly passed; validate any provided URLs
    if (videoUrls !== undefined) {
      try {
        updateData.videoUrls = validateAndCleanVideos(videoUrls);
      } catch (validationErr) {
        return res.status(400).json({ success: false, message: validationErr.message });
      }
    }

    // If title, description, or content changed, regenerate translations
    if (title !== undefined || description !== undefined || content !== undefined) {
      const existingModule = await Module.findById(id);
      if (existingModule) {
        try {
          const freshTranslations = await translateModuleData({
            title: title !== undefined ? title.trim() : existingModule.title,
            description: description !== undefined ? description?.trim() : existingModule.description,
            content: content !== undefined ? content : existingModule.content,
          });
          updateData.translations = freshTranslations;
        } catch (tErr) {
          console.warn("Translation failed during adminUpdateModule:", tErr.message);
        }
      }
    }

    const module = await Module.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!module) return res.status(404).json({ success: false, message: "Module not found." });

    return res.status(200).json({ success: true, module });
  } catch (error) {
    console.error("Error in adminUpdateModule:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// DELETE /api/admin/modules/:id
export const adminDeleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid module ID." });
    }

    const module = await Module.findByIdAndDelete(id);
    if (!module) return res.status(404).json({ success: false, message: "Module not found." });

    // Also delete related quiz and progress
    await Quiz.deleteMany({ moduleId: id });
    await Progress.deleteMany({ moduleId: id });
    await Feedback.deleteMany({ module: id });

    return res.status(200).json({ success: true, message: "Module deleted successfully." });
  } catch (error) {
    console.error("Error in adminDeleteModule:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ==========================================
// QUIZZES
// ==========================================

// GET /api/admin/quizzes
export const adminGetQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("moduleId", "title slug").lean();
    return res.status(200).json({ success: true, quizzes });
  } catch (error) {
    console.error("Error in adminGetQuizzes:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// POST /api/admin/quizzes
export const adminCreateQuiz = async (req, res) => {
  try {
    const { moduleId, questions } = req.body;

    if (!moduleId || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "Module ID and at least one question are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({ success: false, message: "Invalid module ID." });
    }

    const module = await Module.findById(moduleId);
    if (!module) return res.status(404).json({ success: false, message: "Module not found." });

    const existing = await Quiz.findOne({ moduleId });
    if (existing) {
      return res.status(409).json({ success: false, message: "A quiz for this module already exists. Use PUT to update." });
    }

    const sanitizedQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q || typeof q.question !== "string" || !q.question.trim()) {
        return res.status(400).json({ success: false, message: `Question #${i + 1} must have question text.` });
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({ success: false, message: `Question #${i + 1} must have at least 2 options.` });
      }
      const cleanOptions = q.options.map((opt) => String(opt || "").trim());
      if (cleanOptions.some((opt) => !opt)) {
        return res.status(400).json({ success: false, message: `Question #${i + 1} contains empty option text.` });
      }
      const cIndex = Number(q.correctIndex ?? 0);
      if (isNaN(cIndex) || cIndex < 0 || cIndex >= cleanOptions.length) {
        return res.status(400).json({ success: false, message: `Question #${i + 1} has an invalid correct answer selection.` });
      }
      sanitizedQuestions.push({
        question: q.question.trim(),
        options: cleanOptions,
        correctIndex: cIndex,
        explanation: (q.explanation && typeof q.explanation === "string" && q.explanation.trim()) || "",
      });
    }

    let translations = {};
    try {
      translations = await translateQuizData(sanitizedQuestions);
    } catch (tErr) {
      console.warn("Translation failed during adminCreateQuiz:", tErr.message);
    }

    const quiz = await Quiz.create({ moduleId, questions: sanitizedQuestions, translations });
    const populated = await Quiz.findById(quiz._id).populate("moduleId", "title slug");
    return res.status(201).json({ success: true, quiz: populated });
  } catch (error) {
    console.error("Error in adminCreateQuiz:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// PUT /api/admin/quizzes/:id
export const adminUpdateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid quiz ID." });
    }

    const { questions } = req.body;
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "At least one question is required." });
    }

    const sanitizedQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q || typeof q.question !== "string" || !q.question.trim()) {
        return res.status(400).json({ success: false, message: `Question #${i + 1} must have question text.` });
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({ success: false, message: `Question #${i + 1} must have at least 2 options.` });
      }
      const cleanOptions = q.options.map((opt) => String(opt || "").trim());
      if (cleanOptions.some((opt) => !opt)) {
        return res.status(400).json({ success: false, message: `Question #${i + 1} contains empty option text.` });
      }
      const cIndex = Number(q.correctIndex ?? 0);
      if (isNaN(cIndex) || cIndex < 0 || cIndex >= cleanOptions.length) {
        return res.status(400).json({ success: false, message: `Question #${i + 1} has an invalid correct answer selection.` });
      }
      sanitizedQuestions.push({
        _id: q._id || undefined,
        question: q.question.trim(),
        options: cleanOptions,
        correctIndex: cIndex,
        explanation: (q.explanation && typeof q.explanation === "string" && q.explanation.trim()) || "",
      });
    }

    let translations = {};
    try {
      translations = await translateQuizData(sanitizedQuestions);
    } catch (tErr) {
      console.warn("Translation failed during adminUpdateQuiz:", tErr.message);
    }

    const quiz = await Quiz.findByIdAndUpdate(
      id,
      { questions: sanitizedQuestions, translations },
      { new: true, runValidators: true }
    ).populate("moduleId", "title slug");

    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found." });

    return res.status(200).json({ success: true, quiz });
  } catch (error) {
    console.error("Error in adminUpdateQuiz:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// DELETE /api/admin/quizzes/:id
export const adminDeleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid quiz ID." });
    }

    const quiz = await Quiz.findByIdAndDelete(id);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found." });

    return res.status(200).json({ success: true, message: "Quiz deleted successfully." });
  } catch (error) {
    console.error("Error in adminDeleteQuiz:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ==========================================
// KNOWLEDGE ARTICLES
// ==========================================

// GET /api/admin/knowledge
export const adminGetKnowledge = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }
    const articles = await KnowledgeArticle.find(filter).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, articles });
  } catch (error) {
    console.error("Error in adminGetKnowledge:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// POST /api/admin/knowledge
export const adminCreateKnowledge = async (req, res) => {
  try {
    const { title, category, content, tags, sourceUrl, source, moduleSlug } = req.body;
    if (!title || !category || !content) {
      return res.status(400).json({ success: false, message: "Title, category, and content are required." });
    }

    const article = await KnowledgeArticle.create({
      title: title.trim(),
      category,
      content: content.trim(),
      tags: tags || [],
      sourceUrl,
      source,
      moduleSlug,
    });

    return res.status(201).json({ success: true, article });
  } catch (error) {
    console.error("Error in adminCreateKnowledge:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// PUT /api/admin/knowledge/:id
export const adminUpdateKnowledge = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid article ID." });
    }

    const { title, category, content, tags, sourceUrl, source, moduleSlug } = req.body;
    const article = await KnowledgeArticle.findByIdAndUpdate(
      id,
      { title, category, content, tags, sourceUrl, source, moduleSlug },
      { new: true, runValidators: true }
    );
    if (!article) return res.status(404).json({ success: false, message: "Article not found." });

    return res.status(200).json({ success: true, article });
  } catch (error) {
    console.error("Error in adminUpdateKnowledge:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// DELETE /api/admin/knowledge/:id
export const adminDeleteKnowledge = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid article ID." });
    }

    const article = await KnowledgeArticle.findByIdAndDelete(id);
    if (!article) return res.status(404).json({ success: false, message: "Article not found." });

    return res.status(200).json({ success: true, message: "Article deleted." });
  } catch (error) {
    console.error("Error in adminDeleteKnowledge:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ==========================================
// FEEDBACK MANAGEMENT
// ==========================================

// GET /api/admin/feedback
export const adminGetFeedback = async (req, res) => {
  try {
    const { status, moduleId, rating, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (moduleId && mongoose.Types.ObjectId.isValid(moduleId)) filter.module = moduleId;
    if (rating) filter.rating = Number(rating);

    const skip = (Number(page) - 1) * Number(limit);
    const [feedbacks, total] = await Promise.all([
      Feedback.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("user", "name email")
        .populate("module", "title slug icon")
        .lean(),
      Feedback.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      feedbacks,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Error in adminGetFeedback:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// PATCH /api/admin/feedback/:id/status
export const adminUpdateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "reviewed", "resolved"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid feedback ID." });
    }

    const feedback = await Feedback.findByIdAndUpdate(id, { status }, { new: true });
    if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found." });

    return res.status(200).json({ success: true, feedback });
  } catch (error) {
    console.error("Error in adminUpdateFeedbackStatus:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// DELETE /api/admin/feedback/:id
export const adminDeleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid feedback ID." });
    }

    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found." });

    return res.status(200).json({ success: true, message: "Feedback deleted." });
  } catch (error) {
    console.error("Error in adminDeleteFeedback:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// ==========================================
// ANALYTICS
// GET /api/admin/analytics
// ==========================================
export const getAnalytics = async (req, res) => {
  try {
    // Users by level
    const usersByLevel = await User.aggregate([
      { $match: { role: "student" } },
      { $group: { _id: "$level", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Module completion counts
    const moduleCompletions = await Progress.aggregate([
      { $match: { completed: true } },
      { $group: { _id: "$moduleId", count: { $sum: 1 }, avgScore: { $avg: "$quizScore" } } },
      { $lookup: { from: "modules", localField: "_id", foreignField: "_id", as: "module" } },
      { $unwind: { path: "$module", preserveNullAndEmptyArrays: true } },
      { $project: { title: "$module.title", icon: "$module.icon", count: 1, avgScore: { $round: ["$avgScore", 1] } } },
      { $sort: { count: -1 } },
    ]);

    // Score distribution
    const scoreDistribution = await Progress.aggregate([
      { $match: { completed: true } },
      {
        $bucket: {
          groupBy: "$quizScore",
          boundaries: [0, 20, 40, 60, 80, 101],
          default: "Other",
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    // Badge distribution
    const badgeDistribution = await User.aggregate([
      { $unwind: "$badges" },
      { $group: { _id: "$badges.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Feedback stats by module
    const feedbackByModule = await Feedback.aggregate([
      { $group: { _id: "$module", count: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
      { $lookup: { from: "modules", localField: "_id", foreignField: "_id", as: "module" } },
      { $unwind: { path: "$module", preserveNullAndEmptyArrays: true } },
      { $project: { title: "$module.title", count: 1, avgRating: { $round: ["$avgRating", 1] } } },
      { $sort: { count: -1 } },
    ]);

    // Recent registrations by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const registrationsByDay = await User.aggregate([
      { $match: { role: "student", createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      analytics: {
        usersByLevel,
        moduleCompletions,
        scoreDistribution,
        badgeDistribution,
        feedbackByModule,
        registrationsByDay,
      },
    });
  } catch (error) {
    console.error("Error in getAnalytics:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
