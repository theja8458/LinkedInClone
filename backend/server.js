import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postsRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(postsRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));


const start  = async()=>{
   const connectDB = await mongoose.connect("mongodb+srv://sugamanch:x2LXfyHuzjcZEPcp@apnaproconnect.2feddwo.mongodb.net/?retryWrites=true&w=majority&appName=apnaproconnect");
 
    app.listen(9090 , ()=>{
        console.log("Server is running on port 9090");
    })
};

start();