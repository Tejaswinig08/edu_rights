import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const maxRetries = 5;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      attempts++;
      console.log(`[Database] Connecting to MongoDB (Attempt ${attempts}/${maxRetries})...`);
      await connectDB();
      break;
    } catch (error) {
      console.error(`[Database] Attempt ${attempts} failed: ${error.message}`);
      if (attempts >= maxRetries) {
<<<<<<< HEAD
        console.error("❌ Fatal: Could not connect to MongoDB after multiple attempts. Exiting.");
=======
        console.error("Fatal: Could not connect to MongoDB after multiple attempts. Exiting.");
>>>>>>> origin/feature/tejaswini-final
        process.exit(1);
      }
      console.log("[Database] Retrying in 3 seconds...");
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  app.listen(PORT, () => {
<<<<<<< HEAD
    console.log(`🚀 EduRight server running on http://localhost:${PORT}`);
=======
    console.log(`EduRight server running on http://localhost:${PORT}`);
>>>>>>> origin/feature/tejaswini-final
  });
};

startServer();