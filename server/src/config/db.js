
import dns from "node:dns";
import mongoose from "mongoose";

// Use Google's DNS servers for MongoDB SRV lookups
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log(
      `MongoDB connected: ${conn.connection.host} (DB: ${conn.connection.name})`
    );
    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Attempting reconnection...");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected successfully.");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

export default connectDB;
