import express from "express";
import { getArticles, getArticleById } from "../controllers/knowledgeController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getArticles);
router.get("/:id", getArticleById);

export default router;
