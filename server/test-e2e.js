import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";
import Module from "./src/models/Module.js";
import Progress from "./src/models/Progress.js";
import Feedback from "./src/models/Feedback.js";
import app from "./src/app.js";

dotenv.config();

async function runTests() {
  console.log("=== STARTING BACKEND & SECURITY TESTS ===");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  // 1. Get or create student and admin
  let student = await User.findOne({ email: "teststudent@eduright.com" });
  if (!student) {
    const hash = await bcrypt.hash("Student@12345", 12);
    student = await User.create({
      name: "Test Student",
      email: "teststudent@eduright.com",
      password: hash,
      role: "student",
      isVerified: true,
      points: 100,
      level: 2,
    });
  }

  let admin = await User.findOne({ email: "admin@eduright.com" });
  if (!admin) {
    const hash = await bcrypt.hash("Admin@12345", 12);
    admin = await User.create({
      name: "System Admin",
      email: "admin@eduright.com",
      password: hash,
      role: "admin",
      isVerified: true,
    });
  }

  // 2. Generate tokens using the app's secret
  const studentToken = jwt.sign(
    { userId: student._id.toString(), role: student.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const adminToken = jwt.sign(
    { userId: admin._id.toString(), role: admin.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  // Helper for requests
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  try {
    // TEST 1: Unauthenticated request to /api/admin/dashboard -> Expect 401
    const res1 = await fetch(`${baseUrl}/api/admin/dashboard`);
    console.log(`[TEST 1] Unauthenticated -> /api/admin/dashboard: status = ${res1.status} (Expected 401)`);
    if (res1.status !== 401) throw new Error("Security check failed: unauthenticated allowed");

    // TEST 2: Student request to /api/admin/dashboard -> Expect 403
    const res2 = await fetch(`${baseUrl}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const data2 = await res2.json();
    console.log(`[TEST 2] Student role -> /api/admin/dashboard: status = ${res2.status}, msg = "${data2.message}" (Expected 403)`);
    if (res2.status !== 403) throw new Error("Security check failed: student permitted to admin route");

    // TEST 3: Admin request to /api/admin/dashboard -> Expect 200
    const res3 = await fetch(`${baseUrl}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data3 = await res3.json();
    console.log(`[TEST 3] Admin role -> /api/admin/dashboard: status = ${res3.status}, success = ${data3.success}`);
    console.log(`         Dashboard stats:`, data3.stats);
    if (res3.status !== 200 || !data3.success) throw new Error("Admin dashboard failed");

    // TEST 4: Get a module and mark it completed for student, then submit feedback
    const firstModule = await Module.findOne();
    if (!firstModule) throw new Error("No modules found in DB");

    // Mark module as completed for student
    await Progress.findOneAndUpdate(
      { userId: student._id, moduleId: firstModule._id },
      { completed: true, quizScore: 90, completedAt: new Date() },
      { upsert: true }
    );

    // TEST 5: Student submit feedback for completed module -> Expect 200
    const res5 = await fetch(`${baseUrl}/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        moduleId: firstModule._id.toString(),
        rating: 5,
        comment: "Excellent module! Very informative and easy to follow.",
      }),
    });
    const data5 = await res5.json();
    console.log(`[TEST 5] Student feedback on completed module: status = ${res5.status}, msg = "${data5.message}"`);
    if (res5.status !== 200 || !data5.success) throw new Error("Feedback submission failed");

    // TEST 6: Student get my feedback -> Expect 200
    const res6 = await fetch(`${baseUrl}/api/feedback/my`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const data6 = await res6.json();
    console.log(`[TEST 6] Student get my feedback: count = ${data6.feedbacks?.length} (Expected >= 1)`);
    if (res6.status !== 200 || data6.feedbacks?.length === 0) throw new Error("Get my feedback failed");

    // TEST 7: Admin get all feedback -> Expect 200
    const res7 = await fetch(`${baseUrl}/api/admin/feedback`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data7 = await res7.json();
    console.log(`[TEST 7] Admin get all feedback: total = ${data7.total}`);
    if (res7.status !== 200 || !data7.success) throw new Error("Admin feedback list failed");

    // TEST 8: Admin update feedback status -> Expect 200
    const feedbackId = data5.feedback._id;
    const res8 = await fetch(`${baseUrl}/api/admin/feedback/${feedbackId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "reviewed" }),
    });
    const data8 = await res8.json();
    console.log(`[TEST 8] Admin update feedback status to reviewed: status = ${res8.status}, newStatus = "${data8.feedback?.status}"`);
    if (res8.status !== 200 || data8.feedback?.status !== "reviewed") throw new Error("Feedback status update failed");

    // TEST 9: Admin get users list
    const res9 = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data9 = await res9.json();
    console.log(`[TEST 9] Admin get users: total = ${data9.total}, count on page = ${data9.users?.length}`);
    if (res9.status !== 200 || !data9.success) throw new Error("Admin users list failed");

    // TEST 10: Admin get analytics
    const res10 = await fetch(`${baseUrl}/api/admin/analytics`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data10 = await res10.json();
    console.log(`[TEST 10] Admin get analytics: success = ${data10.success}, sections = ${Object.keys(data10.analytics).join(", ")}`);
    if (res10.status !== 200 || !data10.success) throw new Error("Admin analytics failed");

    // Clean up test student
    await Feedback.deleteMany({ user: student._id });
    await Progress.deleteMany({ userId: student._id });
    await User.findByIdAndDelete(student._id);

    console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! Security & CRUD are fully operational.");
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
