
import Profile from "../models/profile.model.js"
import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import ConnectionRequest from "../models/connections.model.js";
import bycrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import axios from "axios";

const convertUserDataTOPDF = async (userData) => {
  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);
  doc.pipe(stream);
  const isCloudinary = userData.userId.profilePicture?.startsWith("http");
  try {
    if (isCloudinary) {
      const response = await axios.get(userData.userId.profilePicture, {
        responseType: "arraybuffer",
      });

      const imageBuffer = Buffer.from(response.data, "binary");
      doc.image(imageBuffer, { align: "center", width: 100 });
    } else {
      doc.image(`uploads/${userData.userId.profilePicture}`, {
        align: "center",
        width: 100,
      });
    }
  } catch (err) {
    console.warn("⚠️ Failed to load profile picture for PDF:", err.message);
  }

  doc.fontSize(14).text(`Name : ${userData.userId.name}`);
  doc.fontSize(14).text(`Username : ${userData.userId.username}`);
  doc.fontSize(14).text(`Email : ${userData.userId.email}`);
  doc.fontSize(14).text(`Bio : ${userData.bio}`);
  doc.fontSize(14).text(`Current Position : ${userData.currentPost}`);
  doc.fontSize(14).text(`Past Work:`);

  userData.pastwork.forEach((work) => {
    doc.fontSize(14).text(`Company Name : ${work.company}`);
    doc.fontSize(14).text(`Position : ${work.position}`);
    doc.fontSize(14).text(`Years : ${work.years}`);
  });

  doc.end();
  return outputPath;
};
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
    console.log("⚙️ Controller hit: updateProfileData"); // ✅ Add this
  console.log("Headers:", req.headers); // See if it's multipart/form-data
  console.log("📦 Received File:", req.file); // ← This should work if multer runs
  console.log("📨 Body:", req.body);
  try {
    const { token, ...newUserData } = req.body;

    // 🛡️ Find the user based on token
    const userProfile = await User.findOne({ token });
    if (!userProfile) {
      return res.status(404).json({ message: "User does not exist" });
    }

    console.log("📦 Received File:", req.file);
console.log("📨 Body:", req.body);    
    
     if (req.file) {
  // multer-storage-cloudinary gives `path` or `url`
  const cloudinaryUrl = req.file.path || req.file.url;

  if (cloudinaryUrl) {
    userProfile.profilePicture = cloudinaryUrl;
    await userProfile.save();
  }
}

    // ✅ Safely Parse Arrays from Stringified FormData
    ["pastwork", "education"].forEach((field) => {
      if (typeof newUserData[field] === "string") {
        try {
          const parsed = JSON.parse(newUserData[field]);

          if (Array.isArray(parsed)) {
            newUserData[field] = parsed;
          } else {
            newUserData[field] = [];
          }
        } catch (err) {
          return res.status(400).json({ message: `Invalid format for ${field}` });
        }
      }
    });

    // 📄 Get the user's profile document
    const profile_to_update = await Profile.findOne({ userId: userProfile._id });
    if (!profile_to_update) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // 🧠 Merge updated fields (like bio, education, pastwork, etc.)
    Object.assign(profile_to_update, newUserData);
    await profile_to_update.save();

    // ✅ Return success
    return res.status(200).json({ message: "Profile updated" });
  } catch (err) {
    // 🛑 Catch-all error handling
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
  const user_id = req.query.id;

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




