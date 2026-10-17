import Quiz from "../models/Quiz.js";
import Module from "../models/Module.js";
import Progress from "../models/Progress.js";
import User from "../models/User.js";

const LEVEL_THRESHOLDS = [0, 100, 200, 325, 450];
const LEVEL_BADGES = [
<<<<<<< HEAD
  "Welcome Explorer 🌟",
  "Quick Learner 📖",
  "Rights Champion 🛡️",
  "Knowledge Hero 🦸",
  "Justice Master ⚖️",
=======
  "Welcome Explorer",
  "Quick Learner",
  "Rights Champion",
  "Knowledge Hero",
  "Justice Master",
>>>>>>> origin/feature/tejaswini-final
];

// Badge awarded when a module is completed (score >= 70%)
const MODULE_BADGES = {
<<<<<<< HEAD
  "my-safety-and-identity": { name: "Safety Guardian 🛡️", icon: "🛡️" },
  "my-life-and-wellbeing": { name: "Life Protector ❤️", icon: "❤️" },
  "my-learning-and-growth": { name: "Knowledge Seeker 📚", icon: "📚" },
  "my-voice-and-freedom": { name: "Voice Champion 🗣️", icon: "🗣️" },
  "my-family-equality-and-inclusion": { name: "Equality Hero ⚖️", icon: "⚖️" },
  "my-play-and-privacy": { name: "Play & Privacy Star ⚽", icon: "⚽" },
=======
  "my-safety-and-identity": { name: "Safety Guardian", icon: "" },
  "my-life-and-wellbeing": { name: "Life Protector", icon: "" },
  "my-learning-and-growth": { name: "Knowledge Seeker", icon: "" },
  "my-voice-and-freedom": { name: "Voice Champion", icon: "" },
  "my-family-equality-and-inclusion": { name: "Equality Hero", icon: "" },
  "my-play-and-privacy": { name: "Play & Privacy Star", icon: "" },
>>>>>>> origin/feature/tejaswini-final
};

// ==========================================
// Get Quiz
// ==========================================
export const getQuiz = async (req, res) => {
  try {
    const { slug } = req.params;
    const module = await Module.findOne({ slug });
    if (!module) return res.status(404).json({ success: false, message: "Module not found" });

    const quiz = await Quiz.findOne({ moduleId: module._id }).lean();
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    // Strip correctIndex and explanation
    const sanitizedQuestions = quiz.questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

<<<<<<< HEAD
=======
    let sanitizedTranslations = undefined;
    if (quiz.translations && typeof quiz.translations === "object") {
      sanitizedTranslations = {};
      for (const [lang, tList] of Object.entries(quiz.translations)) {
        if (Array.isArray(tList)) {
          sanitizedTranslations[lang] = tList.map((tq) => ({
            question: tq.question,
            options: tq.options,
          }));
        }
      }
    }

>>>>>>> origin/feature/tejaswini-final
    return res.status(200).json({
      success: true,
      quiz: {
        _id: quiz._id,
        moduleId: quiz.moduleId,
        questions: sanitizedQuestions,
<<<<<<< HEAD
=======
        translations: sanitizedTranslations,
>>>>>>> origin/feature/tejaswini-final
      },
    });
  } catch (error) {
    console.error("Error in getQuiz:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==========================================
// Submit Quiz
// ==========================================
export const submitQuiz = async (req, res) => {
  try {
    const { slug } = req.params;
    const { answers } = req.body; // Array of selected indexes

    const module = await Module.findOne({ slug });
    if (!module) return res.status(404).json({ success: false, message: "Module not found" });

    const quiz = await Quiz.findOne({ moduleId: module._id });
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    let correctCount = 0;
    const results = [];

    quiz.questions.forEach((q, idx) => {
      const userAnswer = answers[idx];
      const isCorrect = userAnswer === q.correctIndex;
      if (isCorrect) correctCount++;
      
      results.push({
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        userAnswer,
        explanation: q.explanation,
      });
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    
    // Check progress
    let progress = await Progress.findOne({ userId: req.user.userId, moduleId: module._id });
    const oldScore = progress ? progress.quizScore : 0;
    const wasCompleted = progress ? progress.completed : false;
    
    let pointsEarned = 0;
    const newBadges = [];
    let user = await User.findById(req.user.userId);
    let userUpdated = false;

    if (score > oldScore) {
      const oldPoints = Math.round((oldScore / 100) * module.pointsReward);
      const newPoints = Math.round((score / 100) * module.pointsReward);
      pointsEarned = newPoints - oldPoints;
      
      user.points += pointsEarned;
      userUpdated = true;
      
      // Calculate new level
      let newLevel = 1;
      for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (user.points >= LEVEL_THRESHOLDS[i]) {
          newLevel = i + 1;
          break;
        }
      }
      
      // Award level-up badge
      if (newLevel > user.level) {
        user.level = newLevel;
        const badgeIndex = newLevel - 1;
        if (badgeIndex < LEVEL_BADGES.length) {
          const badgeName = LEVEL_BADGES[badgeIndex];
<<<<<<< HEAD
          const hasBadge = user.badges.some((b) => b.name === badgeName);
          if (!hasBadge) {
            const levelBadge = { name: badgeName, icon: "🏅" };
=======
          const hasBadge = user.badges.some((b) => b.name === badgeName || b.name.startsWith(badgeName));
          if (!hasBadge) {
            const levelBadge = { name: badgeName, icon: "" };
>>>>>>> origin/feature/tejaswini-final
            user.badges.push(levelBadge);
            newBadges.push(levelBadge);
          }
        }
      }
      
      // Update progress
      if (!progress) {
        progress = new Progress({
          userId: req.user.userId,
          moduleId: module._id,
        });
      }
      progress.quizScore = score;
      if (score >= 70) {
        progress.completed = true;
        progress.completedAt = new Date();
      }
      await progress.save();
    }

    // Award module completion badge (score >= 70%), even if retaking a previously maxed quiz
    if (score >= 70) {
      const moduleBadge = MODULE_BADGES[slug];
      if (moduleBadge) {
<<<<<<< HEAD
        const hasBadge = user.badges.some((b) => b.name === moduleBadge.name);
=======
        const hasBadge = user.badges.some((b) => b.name === moduleBadge.name || b.name.startsWith(moduleBadge.name));
>>>>>>> origin/feature/tejaswini-final
        if (!hasBadge) {
          user.badges.push({ name: moduleBadge.name, icon: moduleBadge.icon });
          newBadges.push(moduleBadge);
          userUpdated = true;
        }
      }
    }

    if (userUpdated) {
      await user.save();
    }

    return res.status(200).json({
      success: true,
      score,
      pointsEarned,
      totalPoints: user.points,
      level: user.level,
      newBadge: newBadges.length > 0 ? newBadges[0] : null,
      newBadges,
      results,
    });

  } catch (error) {
    console.error("Error in submitQuiz:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
