import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import knowledgeRoutes from "./routes/knowledgeRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

/* ==============================
   SECURITY
============================== */

app.use(helmet());


/* ==============================
   CORS
============================== */

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



/* ==============================
   BODY PARSER
============================== */

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);


/* ==============================
   COOKIES
============================== */

app.use(cookieParser());


/* ==============================
   GENERAL RATE LIMIT
============================== */

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 200,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

app.use(generalLimiter);


/* ==============================
   HEALTH CHECK
============================== */

app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "EduRight API is running",
    });
  }
);


/* ==============================
   DB READINESS CHECK
============================== */

app.use((req, res, next) => {
  if (req.path === "/api/health" || req.path === "/") {
    return next();
  }
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database connection is establishing. Please try again in a few moments.",
    });
  }
  next();
});


/* ==============================
   ROUTES
============================== */

app.use("/api/auth", authRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);


/* ==============================
   ROOT ROUTE
============================== */

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to EduRight API",
    });
  }
);


/* ==============================
   404 HANDLER
============================== */

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  }
);


export default app;
