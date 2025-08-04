import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionRequest, loginUser, registerUser, } from "../../action/authAction";


const initialState = {
    user: undefined,
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn:false,
    message: "",
    isTokenThere: false,
    profileFetched: false,
    connections: [],
    connectionRequest: [], 
    all_users: [],
    all_profiles_fetched: false
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        reset: ()=> initialState,
        handleLoginUser: (state)=>{
            state.message = "hello"
        },
        emptyMessage:(state)=>{
          state.message=""
        },
        setTokenIsThere: (state)=>{
          state.isTokenThere = true
        },
        setTokenIsNotThere: (state)=>{
          state.isTokenThere = false
        }
    },
    extraReducers:(builder) =>{
      builder
      .addCase(loginUser.pending , (state) =>{
        state.isLoading = true
        state.message = "Kncoking the door.."
      })
      .addCase(loginUser.fulfilled , (state,action)=>{

        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Login is successfull"
      })
      .addCase(loginUser.rejected, (state,action)=>{
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(registerUser.pending , (state)=>{
        state.isLoading = true
        state.message = "Registering you..."
      })
      .addCase(registerUser.fulfilled , (state  ,action)=>{
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = false;
        state.message = {
          message: "Registration is Successfull , Please log in"
        }
      })
      .addCase(registerUser.rejected , (state,action)=>{
       state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAboutUser.fulfilled, (state,action)=>{
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload.userProfile;
      })
      .addCase(getAllUsers.fulfilled , (state,action) =>{
        state.isLoading = false;
        state.isError = false;
        state.all_profiles_fetched = true;
        state.all_users = action.payload.profiles;

      })
      .addCase(getConnectionsRequest.fulfilled , (state,action)=>{
        state.connections = action.payload
      })
      .addCase(getConnectionsRequest.rejected , (state,action)=>{
        state.message = action.payload
      })
      .addCase(getMyConnectionRequest.fulfilled, (state,action) =>{
        state.connectionRequest = action.payload
      })
      .addCase(getMyConnectionRequest.rejected, (state,action) =>{
        state.message = action.payload;
      })
      
    }
});

export const {reset , emptyMessage , setTokenIsThere , setTokenIsNotThere} = authSlice.actions;

export default authSlice.reducer;