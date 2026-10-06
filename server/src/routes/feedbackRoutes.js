import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  submitFeedback,
  getMyFeedback,
  getModuleFeedback,
  getMyFeedbackForModule,
} from "../controllers/feedbackController.js";

const router = express.Router();

// All feedback routes require authentication
router.use(protect);

// POST /api/feedback — submit feedback
router.post("/", submitFeedback);

// GET /api/feedback/my — get my feedback list
router.get("/my", getMyFeedback);

// GET /api/feedback/my/:moduleId — get my feedback for specific module
router.get("/my/:moduleId", getMyFeedbackForModule);

// GET /api/feedback/module/:moduleId — get all feedback for a module
router.get("/module/:moduleId", getModuleFeedback);

export default router;
