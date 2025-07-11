import User from "../models/user.model.js";
import Post from "../models/posts.model.js"
export const runningCheck = async (req,res)=>{
  return res.status(200).json({message : "RUNNING"});
};


export const createPost = async (req,res)=>{
   const {token} = req.body;

   try{
    const user  = await User.findOne({token: token});
    if(!user){
      return res.status(404).json({message : "User does not exists"});
    }
    
    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename: "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",

    });

    await post.save();

    return res.status(200).json({message: "Post Created"});
   }catch(err){
    return res.status(500).json({message : err.message});
   }
};

export const getAllUserPosts = async (req,res)=>{
  const {token} = req.body;
  try{
   const user  = await User.findOne({token: token});
    if(!user){
      return res.status(404).json({message : "User does not exists"});
    };

    const posts = await Post.find({userId: user._id});

    return res.json(posts);

  }catch(err){
    return res.status(500).json({message: err.message});
  }
}

export const getAllPosts = async (req,res)=>{
  
  try{
   

    const posts = await Post.find().populate("userId" , "name username email profilePicture");

    return res.json({posts});

  }catch(err){
    return res.status(500).json({message: err.message});
  }
};

export const deletePost = async (req,res)=>{
  const {token , post_id} = req.body;

  try{
   const user  = await User.findOne({token: token})
   .select("_id");
    if(!user){
      return res.status(404).json({message : "User does not exists"});
    };

    const post = await Post.findOne({_id: post_id});

    if(!post){
      return res.status(404).json({message: "Post not found"});
    }

    if(post.userId.toString() !== user._id.toString()){
      return res.status(401).json({message: "Unauthorized"});
    }

    await Post.deleteOne({_id: post_id});

    return res.json({message: "Post Deleted"});

  }catch(err){
    return res.status(500).res.json({message: err.message});
  }


}