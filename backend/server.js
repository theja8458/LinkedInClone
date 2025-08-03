import './config/loadEnv.js';

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import postsRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";
import path from "path";

const app = express();

app.use(cors());


// ✅ Then apply JSON parsers for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Now you can safely apply other routes
app.use(postsRoutes);
app.use(userRoutes);

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(process.env.PORT || 9090, () => {
    console.log(`✅ Server is running on port ${process.env.PORT || 9090}`);
  });
};

start().catch((err) => {
  console.error("❌ Error starting server:", err);
});