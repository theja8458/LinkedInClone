import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const loginUser = createAsyncThunk(
    "user/login",
    async (user , thunkAPI) =>{
       try{
        const response = await clientServer.post("/login" , {
            email: user.email,
            password: user.password
        });

        if(response.data.token){

        localStorage.setItem("token" , response.data.token);
        }else{
            return thunkAPI.rejectWithValue({mesaage: "token not provided"});
        }

        return thunkAPI.fulfillWithValue(response.data.token);
       }catch(err){
        return thunkAPI.rejectWithValue(err.response.data);
       }
    }
);


export const registerUser = createAsyncThunk(
    "user/register",
    async(user , thunkAPI)=>{
        try {
      const response = await clientServer.post("/register", {
        email: user.email,
        password: user.password,
        username: user.username,
        name: user.name
      });

      
        // return thunkAPI.fulfillWithValue(response.data.token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
    }
);
 
// export const updateProfilePicture = createAsyncThunk(
//   "user/updateProfilePicture",
//   async (user, thunkAPI) => {
//     try {
//       const formData = new FormData();
//       formData.append("profile_picture", user.file);
//       formData.append("token", user.token);

//       // ✅ Let Axios set the Content-Type automatically
//       const response = await clientServer.post("/update_profile_data", formData);

//       thunkAPI.dispatch(getAboutUser({ token: user.token }));

//       return thunkAPI.fulfillWithValue(response.data);
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response.data);
//     }
//   }
// );

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user , thunkAPI)=>{
    try{
     const response = await clientServer.get("/get_user_and_profile" , {
      params:{
        token: user.token,
      }
     });

     return thunkAPI.fulfillWithValue(response.data);

    }catch(err){
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) =>{
      try{
        const response = await clientServer.get("/user/get_all_user_profiles");

        return thunkAPI.fulfillWithValue(response.data);
      }catch(err){
      return thunkAPI.rejectWithValue(err.response.data);
      }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  'user/sendConnectionRequest',
  async(user , thunkAPI)=>{
    try{

      const response = await clientServer.post("/user/send_connection_request",{
        token: user.token,
        connectionId: user.user_id
      });

      thunkAPI.dispatch(getConnectionsRequest({token: user.token}));

      return thunkAPI.fulfillWithValue(response.data);

    }catch(err){
      return thunkAPI.rejectWithValue(err.response.data.mesaage);
    }
  }
);

export const getConnectionsRequest = createAsyncThunk(
  'user/getConnectionsRequest',
  async(user, thunkAPI) =>{
     try{
       const response  = await clientServer.get('/user/getConnectionRequests' , {
        params:{
          token: user.token,
        }
       });

       return thunkAPI.fulfillWithValue(response.data.connections);
     }catch(err){
       
      return thunkAPI.rejectWithValue(err.response.data.mesaage);
     }
  }
);


export const getMyConnectionRequest = createAsyncThunk(
  'user/getMyConnectionRequest',
  async(user , thunkAPI) => {
    try{
     const response = await clientServer.get("/user/user_connection_requests" , {
      params:{
          token: user.token,
        }
     })
     return thunkAPI.fulfillWithValue(response.data)
    }catch(err){
    return thunkAPI.rejectWithValue(err.response.data.mesaage);
    }
  }
);

export const AcceptConnection = createAsyncThunk(
  'user/AcceptConnection',
  async(user , thunkAPI) =>{
    try{

      const response = await clientServer.post('user/accept_connection_request',{
        token: user.token,
        requestId: user.connection_id,
        action_type: user.action
      });

      thunkAPI.dispatch(getConnectionsRequest({token: user.token}));
      thunkAPI.dispatch(getMyConnectionRequest({token: user.token}));


      return thunkAPI.fulfillWithValue(response.data)

    }catch(err){
      return thunkAPI.rejectWithValue(err.response.data.mesaage)
    }
  }
);

