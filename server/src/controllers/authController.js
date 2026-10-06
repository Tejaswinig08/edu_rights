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
    } = req.body;

    // 1. Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

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

    // 8. Create user
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
    });

    // 9. Response
    return res.status(201).json({
      success: true,
      message:
        "Account created successfully.",

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