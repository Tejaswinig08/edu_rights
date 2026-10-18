import express from "express";
import protect from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/requireAdmin.js";
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  adminGetModules,
  adminCreateModule,
  adminUpdateModule,
  adminDeleteModule,
  adminGetQuizzes,
  adminCreateQuiz,
  adminUpdateQuiz,
  adminDeleteQuiz,
  adminGetKnowledge,
  adminCreateKnowledge,
  adminUpdateKnowledge,
  adminDeleteKnowledge,
  adminGetFeedback,
  adminUpdateFeedbackStatus,
  adminDeleteFeedback,
  getAnalytics,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require both authentication AND admin role
router.use(protect, requireAdmin);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Analytics
router.get("/analytics", getAnalytics);

// Users
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/role", updateUserRole);

// Modules
router.get("/modules", adminGetModules);
router.post("/modules", adminCreateModule);
router.put("/modules/:id", adminUpdateModule);
router.delete("/modules/:id", adminDeleteModule);

// Quizzes
router.get("/quizzes", adminGetQuizzes);
router.post("/quizzes", adminCreateQuiz);
router.put("/quizzes/:id", adminUpdateQuiz);
router.delete("/quizzes/:id", adminDeleteQuiz);

// Knowledge Hub
router.get("/knowledge", adminGetKnowledge);
router.post("/knowledge", adminCreateKnowledge);
router.put("/knowledge/:id", adminUpdateKnowledge);
router.delete("/knowledge/:id", adminDeleteKnowledge);

// Feedback
router.get("/feedback", adminGetFeedback);
router.patch("/feedback/:id/status", adminUpdateFeedbackStatus);
router.delete("/feedback/:id", adminDeleteFeedback);

export default router;
