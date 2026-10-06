import Feedback from "../models/Feedback.js";
import Module from "../models/Module.js";
import Progress from "../models/Progress.js";

// ==========================================
// Submit Feedback (POST /api/feedback)
// ==========================================
export const submitFeedback = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { moduleId, rating, comment } = req.body;

    // Validate required fields
    if (!moduleId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Module and rating are required.",
      });
    }

    // Validate rating range
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // Validate comment length
    if (comment && comment.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot exceed 1000 characters.",
      });
    }

    // Verify module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found.",
      });
    }

    // Verify user has completed the module
    const progress = await Progress.findOne({
      userId,
      moduleId,
      completed: true,
    });
    if (!progress) {
      return res.status(403).json({
        success: false,
        message: "You must complete this module before submitting feedback.",
      });
    }

    // Upsert: update if exists, create if not
    const feedback = await Feedback.findOneAndUpdate(
      { user: userId, module: moduleId },
      {
        user: userId,
        module: moduleId,
        rating: numRating,
        comment: comment ? comment.trim() : "",
        status: "pending",
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Feedback submitted successfully.",
      feedback,
    });
  } catch (error) {
    console.error("Error in submitFeedback:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

// ==========================================
// Get My Feedback (GET /api/feedback/my)
// ==========================================
export const getMyFeedback = async (req, res) => {
  try {
    const userId = req.user.userId;

    const feedbacks = await Feedback.find({ user: userId })
      .populate("module", "title slug icon")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (error) {
    console.error("Error in getMyFeedback:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load your feedback.",
    });
  }
};

// ==========================================
// Get Feedback for a Module (GET /api/feedback/module/:moduleId)
// ==========================================
export const getModuleFeedback = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const feedbacks = await Feedback.find({ module: moduleId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    // Strip user info for non-admin callers (only show aggregate)
    const sanitized = feedbacks.map((f) => ({
      _id: f._id,
      rating: f.rating,
      comment: f.comment,
      createdAt: f.createdAt,
    }));

    return res.status(200).json({
      success: true,
      feedbacks: sanitized,
    });
  } catch (error) {
    console.error("Error in getModuleFeedback:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load module feedback.",
    });
  }
};

// ==========================================
// Get single feedback for current user + module
// GET /api/feedback/my/:moduleId
// ==========================================
export const getMyFeedbackForModule = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { moduleId } = req.params;

    const feedback = await Feedback.findOne({
      user: userId,
      module: moduleId,
    }).lean();

    return res.status(200).json({
      success: true,
      feedback: feedback || null,
    });
  } catch (error) {
    console.error("Error in getMyFeedbackForModule:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load feedback.",
    });
  }
};
