import Module from "../models/Module.js";
import Progress from "../models/Progress.js";

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

// Sanitize video data for regular users: expose videoId for player, hide raw URL
const sanitizeVideos = (videoUrls) => {
  if (!Array.isArray(videoUrls)) return [];
  return videoUrls
    .map((v) => {
      const vid = extractYouTubeId(v?.url || v?.videoId);
      return {
        _id: v?._id,
        title: v?.title || "Module Video",
        videoId: vid,
      };
    })
    .filter((v) => Boolean(v.videoId));
};

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
      videoUrls: sanitizeVideos(mod.videoUrls),
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

    const sanitizedModule = {
      ...module,
      videoUrls: sanitizeVideos(module.videoUrls),
    };

    return res.status(200).json({
      success: true,
      module: sanitizedModule,
      progress: progress || null,
    });
  } catch (error) {
    console.error("Error in getModuleBySlug:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
