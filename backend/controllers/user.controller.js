
import Profile from "../models/profile.model.js"
import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import ConnectionRequest from "../models/connections.model.js";
import bycrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";

const convertUserDataTOPDF = async(userData)=>{
   const doc = new PDFDocument();

   const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
   const stream = fs.createWriteStream("uploads/"+ outputPath);

   doc.pipe(stream);

   doc.image(`uploads/${userData.userId.profilePicture}` , {align : "center" , width: 100} )
   doc.fontSize(14).text(`Name : ${userData.userId.name}`);
   doc.fontSize(14).text(`Username : ${userData.userId.username}`);
   doc.fontSize(14).text(`Email : ${userData.userId.email}`);
   doc.fontSize(14).text(`Bio : ${userData.bio}`);
   doc.fontSize(14).text(`Current Position : ${userData.currentPost}`);

   doc.fontSize(14).text(`Past Work: `)
   userData.pastwork.forEach((work , index)=>{
      doc.fontSize(14).text(`Company Name : ${work.company}`);
      doc.fontSize(14).text(`Postion : ${work.position}`);
      doc.fontSize(14).text(`Years : ${work.years}`);

   })

   doc.end();

   return outputPath;

}
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

     await profile.save();

     return res.json({message: "User registered successfully :)"});

    }catch(err){
     return res.status(500).json({message: err.message});
    }
};


export const login = async(req,res)=>{
   try{
     const {email , password} = req.body;

     if(!email || !password) return res.status(400).json({message: "All fields are required"});

     const user = await User.findOne({
      email
     });

     if(!user) return res.status(404).json({message: "User does not exist"}); 

     const isMatch = await  bycrypt.compare(password , user.password);
     if(!isMatch) return res.status(400).json({message: "Invalid Credentials"});

     const token = crypto.randomBytes(32).toString("hex");

     await User.updateOne({_id: user._id , }, {token });

     return res.json({token : token});
   }catch(err){
      return res.status(500).json({message: err.message});
   }
};


export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // ✅ Cloudinary URL
    user.profilePicture = req.file?.path || "";

    await user.save();

    return res.json({ message: "Profile picture updated" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const updateUserProfile = async (req,res)=>{
    try{

      const {token , ...newUserData} = req.body;

      const user = await User.findOne({token: token});

      if(!user) return res.status(404).json({message: "User does not exist"});

      const {username , email} = newUserData;

      const existingUser = await User.findOne({$or : [{username} , {email}]});

      if(existingUser){
         if(existingUser || String(existingUser._id) !== String(user._id)){
            return res.status(400).json({message: "User already exists"});
         }
      }
      
      Object.assign(user,newUserData);

      await user.save();
      return res.json({message: "User updated"});

    }catch(err){
      return res.status(500).json({message: err.message});
    }
};


export const getUserAndProfile = async(req,res)=>{
   try{
      const {token} = req.query;

      const user = await User.findOne({token: token});
       if(!user) return res.status(404).json({message: "User does not exist"});
      
       const userProfile = await Profile.findOne({userId: user._id})
       .populate('userId','name email username profilePicture');

       return res.json({userProfile});

   }catch(err){
      return res.status(500).json({message: err.message});
   }
};


export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const userProfile = await User.findOne({ token: token });
    if (!userProfile) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // ✅ Update profile picture if provided
    if (req.file) {
      userProfile.profilePicture = req.file?.path || "";
      await userProfile.save();
    }

    const profile_to_update = await Profile.findOne({ userId: userProfile._id });

    if (!profile_to_update) {
      return res.status(404).json({ message: "Profile not found" });
    }

    Object.assign(profile_to_update, newUserData);
    await profile_to_update.save();

    return res.json({ message: "Profile updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const getAllUserProfiles = async (req,res)=>{
   try{
      const profiles = await Profile.find().populate("userId" , "name username email profilePicture");

      return res.json({profiles});
    
   }catch(err){
     return res.status(500).json({message: err.message});
   }
};

export const downloadProfile = async(req,res)=>{
   // try{
      
   // }catch(err){
   //     return res.status(500).json({message: err.message});
   // }

   const user_id = req.query.id;

   // return res.json({"message": "Not implemented"});

   const userProfile = await Profile.findOne({userId: user_id})
   .populate("userId" , "name username email profilePicture");

   let outputPath = await convertUserDataTOPDF(userProfile);


   return res.json({message: `uploads/${outputPath}`});
};

export const sentRequestConnection =async (req,res)=>{
   const{token , connectionId} = req.body;
   
   try{
    
      const user = await User.findOne({token:token});

      if(!user){
         return res.status(404).json({message: "User does not exists"});
      }

      const connectionUser = await User.findOne({_id: connectionId});
      if(!connectionUser){
         return res.status(404).json({message: "Connection user not found"});
      }

      const existingRequest = await ConnectionRequest.findOne({userId: user._id,connectionId: connectionUser._id});

      if(existingRequest){
         return res.status(400).json({message: "Request already exists"});
      }

       const request = new ConnectionRequest({
         userId: user._id,
         connectionId: connectionUser._id
       });

       await request.save();

       return res.json({message: "Request sent"});
   }catch(err){
       return res.status(500).json({message: err.message});
   }
};


export const getMyConnectionsRequest = async(req,res)=>{

   const {token} = req.query;
   try{
     const user = await User.findOne({token: token});
     if(!user){
         return res.status(404).json({message: "User does not exists"});
      };
     
      const connections = await ConnectionRequest.find({userId: user._id})
      .populate('connectionId' , 'name username email profilePicture');

      return res.json({connections});
      

   }catch(err){
      return res.status(500).json({message: err.message});
   }
};



export const whatAreMyConnections = async (req,res)=>{
   const {token} = req.query;

   try{
      
      const user = await User.findOne({token: token});
      if(!user){
         return res.status(404).json({message: "User does not exists"});
      };

      const connections = await ConnectionRequest.find({connectionId: user._id})
      .populate("userId" , "name username email profilePicture");

      return res.json(connections);


   }catch(err){
       return res.status(500).json({message: err.message});
   }
};


export const acceptConnectionRequest = async (req,res)=>{
   
      const {token , requestId , action_type} = req.body;
      try{
        const user = await User.findOne({token: token});
         if(!user){
         return res.status(404).json({message: "User does not exists"});
      };

      const connection = await ConnectionRequest.findOne({_id : requestId});

      if (!connection) {
   return res.status(404).json({ message: "Connection request not found" });
}

      if(action_type === "accept"){
         connection.status_accepted = true;
      }else{
         connection.action_type = false;
      }

      await connection.save();

      return res.json({message: "Request updated"});

      }catch(err){
         return res.status(500).json({message: err.message});
      }
};

export const getUserProfileAndUserBasesOnUsername = async(req,res)=>{
     const{username} = req.query;
     try{

      const user = await User.findOne({
         username: username
      });
      if(!user){
         return res.status(404).json({message: "User not found"});
      }

      const userProfile = await Profile.findOne({
         userId: user._id,
      })
      .populate('userId','name username email profilePicture');

      return res.json({"profile": userProfile});

     }catch(err){
      return res.status(500).json({message: err.message});
     }
}




