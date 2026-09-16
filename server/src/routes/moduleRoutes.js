import express from "express";
import { getModules, getModuleBySlug } from "../controllers/moduleController.js";
import { getQuiz, submitQuiz } from "../controllers/quizController.js";
import { getSummary } from "../controllers/progressController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/progress/summary", getSummary);
router.get("/", getModules);
router.get("/:slug", getModuleBySlug);
router.get("/:slug/quiz", getQuiz);
router.post("/:slug/quiz/submit", submitQuiz);

export default router;
