import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    PostId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    comment:{
        type: String,
        require: true
    }
});

const Comment = mongoose.model("Comment",CommentSchema);

export default Comment;