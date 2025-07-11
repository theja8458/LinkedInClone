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
};

export const commentPost = async (req,res)=>{
   const {token , post_id , commentBody} = req.body;
   try{
    const user = await User.findOne({token: token}).select("_id");
      if(!user){
         return res.status(404).json({message: "User does not exists"});
      };
   const post = await Post.findOne({_id: post_id});
      if(!post){
         return res.status(404).json({message: "Post Not Found"});
      }
   const comment = new Comment({
      userId: user._id,
      postId: post_id,
      comment: commentBody
   });

   await comment.save();

   return res.status(200).json({message: "Comment Added"});
   }catch(err){
      return res.status(500).json({message: err.message});
   }
};


export const get_comments_by_post = async (req,res)=>{
   const {post_id} = req.body;

   try{
    const post = await Post.findOne({_id: post_id});
    if(!post){
      return res.status(404).json({message : "Post not found"});
    }

    return res.json({comments: post.comments});
   }catch(err){

   }
};

export const delete_comment_of_user = async (req,res)=>{
   const {comment_id , token} = req.body;

   try{ 
     const user = await User.findOne({token: token})
     .select("_id");

     if(!user){
      return res.status(404).json({message: "User not exists"});
     }

     const comment = await Comment.findOne({_id: comment_id});

     if(!comment){
      return res.status(404).json({message: "Comment not found"});
     }

     if(comment.userId.toString() !== user._id.toString()){
      return res.status(401).json({message :"Unauthorized"});
     }

     await Comment.deleteOne({_id: comment_id});

     return res.status(200).json({message : "Comment Deleted"});
   }catch(err){
    return req.status(500).json({message: err.message});
   }
};

export const increment_likes = async (req,res)=>{

  const {post_id} = req.body;

  try{ 
   const post = Post.findOne({_id: post_id});
     if(!post){
      return res.status(404).json({message : "Post Not Found"});
     }

     await post.save();

     return res.json({message : "Likes incremented"});
  }catch(err){
    return res.status(500).json({message : err.message});
  }
}