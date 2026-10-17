// make-admin.js
// Usage: node make-admin.js <email>
// Promotes a user to admin role

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const email = process.argv[2];

if (!email) {
  console.error("Usage: node make-admin.js <email>");
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to DB.");

const user = await User.findOneAndUpdate(
  { email: email.toLowerCase().trim() },
  { role: "admin" },
  { new: true }
).select("-password");

if (!user) {
  console.error(`No user found with email: ${email}`);
} else {
  console.log(`✅ User "${user.name}" (${user.email}) is now an ADMIN.`);
}

process.exit(0);
