
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bycrypt from "bcrypt";

export const register = async(req,res)=>{
    try{
     const {name,email,password,username} = req.body;
     if(!name || !email || !password || !username){
        return res.status(400).json({message: "All fields are required"});
     }
     const user = await User.findOne({
        email
     });

     if(user)  return res.status(400).json({message: "User already exists"});

     const hashedPassword = await bycrypt.hash(password,10);

     const newUser = new User({
        name,
        username,
        email,
        password: hashedPassword,
     });
     await newUser.save();

     const profile = new Profile({
        userId: newUser._id
     });

     return res.json({message: "User registered successfully :)"});

    }catch(err){
     return res.status(500).json({message: err.message});
    }
}