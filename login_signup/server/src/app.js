import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";

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
    origin: process.env.CLIENT_URL || true,
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
    message: "Too many requests. Please try again later.",
  },
});

app.use(generalLimiter);


/* ==============================
   HEALTH CHECK
============================== */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EduRight API is running",
  });
});


/* ==============================
   AUTH ROUTES
============================== */

app.use("/api/auth", authRoutes);


/* ==============================
   ROOT ROUTE
============================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to EduRight API",
  });
});


/* ==============================
   404 HANDLER
============================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


/* ==============================
   GLOBAL ERROR HANDLER
============================== */

app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});


export default app;