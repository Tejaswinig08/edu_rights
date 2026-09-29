import KnowledgeArticle from "../models/KnowledgeArticle.js";

// ==========================================
// Get Articles
// ==========================================
export const getArticles = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      filter.category = category;
    }

    const articles = await KnowledgeArticle.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      articles,
    });
  } catch (error) {
    console.error("Error in getArticles:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==========================================
// Get Article by ID
// ==========================================
export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await KnowledgeArticle.findById(id);

    if (!article) {
      return res.status(404).json({ success: false, message: "Article not found" });
    }

    return res.status(200).json({
      success: true,
      article,
    });
  } catch (error) {
    console.error("Error in getArticleById:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
