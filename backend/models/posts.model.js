import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
    userId:{
     type: mongoose.Schema.ObjectId,
     ref: "User"
    },
    body: {
     type: String,
     required: true,
    },
    likes:{
     type: Number,
    //  required: true

    },
    createdAt:{
     type: Date,
     default: Date.now
    },
    updatedAt:{
     type: Date,
     default: Date.now
    },
    media:{
     type : String,
     default: ""
    },
    active:{
     type : Boolean,
     default: true
    },
    fileType:{
     type: String,
     default: ""
    }

});

const Post = mongoose.model("Post" , PostSchema);

export default Post;