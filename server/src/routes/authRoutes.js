import express from "express";

import {
  signup,
  login,
  getMe,
<<<<<<< HEAD
  updateProfile,
=======
  updatePreferredLanguage,
>>>>>>> origin/feature/tejaswini-final
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// PUBLIC ROUTES
// ==========================================

router.post(
  "/signup",
  signup
);

router.post(
  "/login",
  login
);


// ==========================================
// PROTECTED ROUTES
// ==========================================

router.get(
  "/me",
  protect,
  getMe
);

router.put(
<<<<<<< HEAD
  "/profile",
  protect,
  updateProfile
);

router.patch(
  "/profile",
  protect,
  updateProfile
=======
  "/language",
  protect,
  updatePreferredLanguage
>>>>>>> origin/feature/tejaswini-final
);


// ==========================================
// LOGOUT
// ==========================================

router.post(
  "/logout",
  (req, res) => {

    res.clearCookie(
      "refreshToken",
      {
        httpOnly: true,
        sameSite: "lax",
        secure:
          process.env.NODE_ENV ===
          "production",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  }
);


export default router;  