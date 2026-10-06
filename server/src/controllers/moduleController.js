import Module from "../models/Module.js";
import Progress from "../models/Progress.js";

// ==========================================
// Get all modules
// ==========================================
export const getModules = async (req, res) => {
  try {
    const modules = await Module.find().sort({ order: 1 }).lean();
    
    // Fetch user progress for these modules
    const progresses = await Progress.find({ userId: req.user.userId }).lean();
    const progressMap = progresses.reduce((acc, prog) => {
      acc[prog.moduleId.toString()] = prog;
      return acc;
    }, {});

    const modulesWithProgress = modules.map((mod) => ({
      ...mod,
      userProgress: progressMap[mod._id.toString()]
        ? {
            completed: progressMap[mod._id.toString()].completed,
            quizScore: progressMap[mod._id.toString()].quizScore,
          }
        : null,
    }));

    return res.status(200).json({ success: true, modules: modulesWithProgress });
  } catch (error) {
    console.error("Error in getModules:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==========================================
// Get module by slug
// ==========================================
export const getModuleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const module = await Module.findOne({ slug }).lean();

    if (!module) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    const progress = await Progress.findOne({
      userId: req.user.userId,
      moduleId: module._id,
    }).lean();

    return res.status(200).json({
      success: true,
      module,
      progress: progress || null,
    });
  } catch (error) {
    console.error("Error in getModuleBySlug:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
