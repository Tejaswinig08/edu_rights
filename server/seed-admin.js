import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to DB.");

const existingAdmin = await User.findOne({ email: "admin@eduright.com" });
if (!existingAdmin) {
  const hashedPassword = await bcrypt.hash("Admin@12345", 12);
  const admin = await User.create({
    name: "System Admin",
    email: "admin@eduright.com",
    password: hashedPassword,
    role: "admin",
    isVerified: true,
  });
  console.log("Created dedicated admin account: admin@eduright.com / Admin@12345");
} else {
  console.log("Admin account admin@eduright.com already exists.");
  if (existingAdmin.role !== "admin") {
    existingAdmin.role = "admin";
    await existingAdmin.save();
    console.log("Updated role to admin.");
  }
}

process.exit(0);
