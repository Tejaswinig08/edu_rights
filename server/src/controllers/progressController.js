import User from "../models/User.js";
import Progress from "../models/Progress.js";
import Module from "../models/Module.js";

// ==========================================
// Get Summary
// ==========================================
export const getSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("points level badges");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const completedCount = await Progress.countDocuments({
      userId: req.user.userId,
      completed: true,
    });

    const totalModules = await Module.countDocuments();

    return res.status(200).json({
      success: true,
      stats: {
        points: user.points,
        level: user.level,
        badges: user.badges,
        completedCount,
        totalModules,
      },
    });
  } catch (error) {
    console.error("Error in getSummary:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
