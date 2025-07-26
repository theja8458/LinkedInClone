import './config/loadEnv.js';


import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import postsRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";
import path from "path";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(postsRoutes);
app.use(userRoutes);



const start  = async()=>{
   const connectDB = await mongoose.connect(process.env.MONGO_URI);
 
   app.listen(process.env.PORT || 9090, () => {
    console.log(`Server is running on port ${process.env.PORT || 9090}`);
});
};

start();