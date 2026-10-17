import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
const users = await mongoose.connection.db.collection("users").find({}).toArray();
console.log("Current users in DB:");
console.log(users.map(u => ({ id: u._id, email: u.email, name: u.name, role: u.role })));
process.exit(0);
