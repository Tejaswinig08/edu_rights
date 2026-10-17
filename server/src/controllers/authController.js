import bcrypt from "bcryptjs";
import User from "../models/User.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokens.js";


// ==========================================
// SIGNUP
// ==========================================

export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
<<<<<<< HEAD
=======
      role = "user",
      adminCode,
>>>>>>> origin/feature/tejaswini-final
    } = req.body;

    // 1. Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

<<<<<<< HEAD
=======
    // 1b. Role validation & Admin Security Check
    const normalizedRole = typeof role === "string" ? role.trim().toLowerCase() : "user";
    if (!["user", "student", "admin"].includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected. Allowed options are User and Admin.",
      });
    }

    let assignedRole = "student";
    if (normalizedRole === "admin") {
      const serverAdminCode = process.env.ADMIN_REGISTRATION_CODE;
      if (!serverAdminCode) {
        console.error("ADMIN_REGISTRATION_CODE is not configured on server.");
        return res.status(500).json({
          success: false,
          message: "Admin registration is currently unavailable.",
        });
      }

      if (!adminCode || typeof adminCode !== "string" || !adminCode.trim()) {
        return res.status(403).json({
          success: false,
          code: "ADMIN_CODE_REQUIRED",
          message: "Admin authorization code is required for administrator registration.",
        });
      }

      if (adminCode.trim() !== serverAdminCode.trim()) {
        return res.status(403).json({
          success: false,
          code: "INVALID_ADMIN_CODE",
          message: "Invalid admin authorization code. You are not authorized to create an Admin account.",
        });
      }

      assignedRole = "admin";
    }

>>>>>>> origin/feature/tejaswini-final
    // 2. Clean input
    const cleanName = name.trim();

    const cleanEmail = email
      .trim()
      .toLowerCase();

    // 3. Validate name
    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Name must be at least 2 characters.",
      });
    }

    // 4. Validate email
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address.",
      });
    }

    // 5. Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters.",
      });
    }

    // 6. Check duplicate email
    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        code: "ACCOUNT_EXISTS",
        message:
          "An account with this email already exists.",
      });
    }

    // 7. Hash password
    const hashedPassword =
      await bcrypt.hash(password, 12);

<<<<<<< HEAD
    // 8. Create user
=======
    // 8. Create user with assigned role
>>>>>>> origin/feature/tejaswini-final
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
<<<<<<< HEAD
=======
      role: assignedRole,
>>>>>>> origin/feature/tejaswini-final
    });

    // 9. Response
    return res.status(201).json({
      success: true,
      message:
<<<<<<< HEAD
        "Account created successfully.",
=======
        assignedRole === "admin"
          ? "Admin account created successfully."
          : "Account created successfully.",
>>>>>>> origin/feature/tejaswini-final

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {
    console.error(
      "Signup error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while creating your account.",
    });
  }
};


// ==========================================
// LOGIN
// ==========================================

export const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // 1. Required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    // 2. Clean email
    const cleanEmail = email
      .trim()
      .toLowerCase();

    // 3. Find user
    const user = await User.findOne({
      email: cleanEmail,
    }).select("+password");

    // 4. User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        code: "INVALID_CREDENTIALS",
        message:
          "Invalid email or password.",
      });
    }

    // 5. Check password
    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        code: "INVALID_CREDENTIALS",
        message:
          "Invalid email or password.",
      });
    }

    // ======================================
    // 6. GENERATE JWT TOKENS
    // ======================================

    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);


    // ======================================
    // 7. STORE REFRESH TOKEN IN COOKIE
    // ======================================

    res.cookie(
      "refreshToken",
      refreshToken,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000,
      }
    );


    // ======================================
    // 8. LOGIN RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,

      message:
        "Login successful.",

      accessToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        points: user.points,
        level: user.level,
        badges: user.badges,
<<<<<<< HEAD
=======
        preferredLanguage: user.preferredLanguage || "en",
>>>>>>> origin/feature/tejaswini-final
      },
    });

  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while logging in.",
    });
  }
};

// ==========================================
// GET CURRENT USER
// ==========================================

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        points: user.points,
        level: user.level,
        badges: user.badges,
<<<<<<< HEAD
=======
        preferredLanguage: user.preferredLanguage || "en",
>>>>>>> origin/feature/tejaswini-final
      },
    });

  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load user information.",
    });
  }
};

// ==========================================
<<<<<<< HEAD
// UPDATE PROFILE
// ==========================================

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.userId;

    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide a name or email to update.",
      });
    }

    const updates = {};

    // Validate and clean name if provided
    if (name !== undefined) {
      const cleanName = typeof name === "string" ? name.trim() : "";
      if (cleanName.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Name must be at least 2 characters.",
        });
      }
      if (cleanName.length > 50) {
        return res.status(400).json({
          success: false,
          message: "Name cannot exceed 50 characters.",
        });
      }
      updates.name = cleanName;
    }

    // Validate and clean email if provided
    if (email !== undefined) {
      const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address.",
        });
      }

      // Check duplicate email
      const existingUser = await User.findOne({
        email: cleanEmail,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          code: "ACCOUNT_EXISTS",
          message: "An account with this email already exists.",
        });
      }

      updates.email = cleanEmail;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        points: updatedUser.points,
        level: updatedUser.level,
        badges: updatedUser.badges,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating your profile.",
    });
=======
// UPDATE PREFERRED LANGUAGE
// ==========================================

export const updatePreferredLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    if (!["en", "hi", "mr", "es"].includes(language)) {
      return res.status(400).json({ success: false, message: "Invalid language selection." });
    }
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { preferredLanguage: language },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      preferredLanguage: user?.preferredLanguage || "en",
    });
  } catch (error) {
    console.error("Error updating preferred language:", error);
    return res.status(500).json({ success: false, message: "Server error." });
>>>>>>> origin/feature/tejaswini-final
  }
};