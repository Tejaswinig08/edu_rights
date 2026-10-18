import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
const users = await mongoose.connection.db.collection("users").find({}).toArray();
console.log("Users:");
for (const u of users) {
  const p = await mongoose.connection.db.collection("progresses").find({ userId: u._id }).toArray();
  console.log(`- ${u.name} (${u.email}): ${p.length} progress docs, completed: ${p.filter(x => x.completed).length}`);
}
process.exit(0);
