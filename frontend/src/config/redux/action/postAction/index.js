import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async(_ , thunkApi)=>{
        try{
            const reponse = await clientServer.get("/posts");

            return thunkApi.fulfillWithValue(reponse.data);
        }catch(err){
            return thunkApi.rejectWithValue(err.response.data);
        }
    }
);

export const createPost  = createAsyncThunk(
    "post/createPost",
    async(userData , thunkApi) =>{
        const {file,body} = userData;
        try{
          
            const formData = new FormData();

            formData.append("file", file); // ✅
formData.append("body", body);
formData.append("token", localStorage.getItem("token"));

            const response = await clientServer.post("/post" , formData, {
                headers:{
                    "Content-type": "multipart/form-data"
                }
            });

            if(response.status === 200){
                return thunkApi.fulfillWithValue("Post Uploaded");
            }else{
                return thunkApi.rejectWithValue("Post not uploaded");
            }

        }catch(err){
            return thunkApi.rejectWithValue(err.response.data);
        }
    }
);

export const deletePost = createAsyncThunk(
    'post/deletePost',
     async(post_id,thunkApi) =>{
        try{
         const response = await clientServer.delete("delete_post", {
            data:{
                token: localStorage.getItem("token"),
                post_id: post_id.post_id
            }
         });

         return thunkApi.fulfillWithValue( response.data);
             
        }catch(err){
          return thunkApi.rejectWithValue("Something went wrong");
        }
     }
);

export const incrementPostLike = createAsyncThunk(
    'post/incrementLike',
    async(post,thunkApi)=>{
        try{
          const response = await clientServer.post("/increment_post_like",{
            post_id: post.post_id,
          });

          return thunkApi.fulfillWithValue(response.data);
        }catch(err){
            return thunkApi.rejectWithValue(err.response.data);
        }
    }
);

export const getAllComments = createAsyncThunk(
    "post/getAllComments",
    async(postData , thunkApi) =>{
        try{
          const response = await clientServer.get("/get_comments" , {
            params:{
                post_id: postData.post_id
            }
          });

          return thunkApi.fulfillWithValue({
            comments: response.data,
            post_id: postData.post_id
          })
        }catch(err){
            return thunkApi.rejectWithValue(err.response.data);
        }
    }
);

export const postComment = createAsyncThunk(
    'post/postComments',
     async(commentData , thunkApi) =>{
        try{
            console.log({post_id: commentData.post_id , body: commentData.body});
            const response = await clientServer.post("/comment",{
                token: localStorage.getItem("token"),
                post_id: commentData.post_id,
                commentBody: commentData.body,
            });

            return thunkApi.fulfillWithValue(response.data);

        }catch(err){
            
            return thunkApi.rejectWithValue("Something Went Wrong");
        }
     }
)