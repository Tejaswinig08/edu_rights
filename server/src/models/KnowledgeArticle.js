import mongoose from "mongoose";

const knowledgeArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["article", "faq", "case-study"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [String],
    sourceUrl: {
      type: String,
    },
    source: {
      type: String,
    },
    moduleSlug: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const KnowledgeArticle = mongoose.model("KnowledgeArticle", knowledgeArticleSchema);
export default KnowledgeArticle;
