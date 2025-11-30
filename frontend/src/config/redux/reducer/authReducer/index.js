import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, getConnectionRequest, getMyConnectionRequest, loginUser,registerUser } from "../../action/authAction";

const initialState = {
   user: undefined,
   isError: false,
   isLoading: false,
   isSuccess: false,
   isloggedIn: false,
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
    reducers: {
        reset: ()=> initialState,
        handleLoginUser: (state, action) => {   
          state.message = "Hello"  
    }, 
        empatyMessage: (state) => {
            state.message = "";
        },
        
        setTokenIsThere: (state, action) => {
            state.isTokenThere = true;
        },
        setTokenIsNotThere: (state, action) => {
            state.isTokenThere = false;
        }     

    },

    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {    
            state.isLoading = true;
            state.message = "Knocking the door...";
        })
        .addCase(loginUser.fulfilled, (state, action) => {    
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.isloggedIn = true;
            state.message = "Logging SuccessFull !"
            state.user = action.payload;
        })
        .addCase(loginUser.rejected, (state, action) => {    
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })    
        .addCase(registerUser.pending, (state) => {    
            state.isLoading = true;
            state.message = "Knocking the door...";
        })
        .addCase(registerUser.fulfilled, (state, action) => {    
            state.isLoading = false;        
            state.isError = false;
            state.isSuccess = true;
            state.isloggedIn = false;
            state.message = "Registration SuccessFull !"
        })
        .addCase(registerUser.rejected, (state, action) => {    
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })  
        .addCase(getAboutUser.pending, (state) => {    
            state.isLoading = true;
            state.message = "Fetching User Data...";
        })
        .addCase(getAboutUser.fulfilled, (state, action) => {    
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.user = action.payload.profile;
            state.profileFetched = true;
            state.message = "User Data Fetched Successfully !"
        })
        .addCase(getAboutUser.rejected, (state, action) => {    
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload; 
        })
        .addCase(getAllUsers.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.all_users = action.payload.profile
            state.all_profiles_fetched = true
            
        })
        .addCase(getConnectionRequest.fulfilled,(state,action)=>{
            // state.connections = action.payload
            state.connections = Array.isArray(action.payload) ? action.payload : [];

        })
        .addCase(getConnectionRequest.rejected,(state,action)=>{
            state.message = action.payload

        })
        .addCase(getMyConnectionRequest.fulfilled,(state,action)=>{
            // state.connectionRequest = action.payload
            state.connectionRequest = Array.isArray(action.payload) ? action.payload : [];
            

           
        })
        .addCase(getMyConnectionRequest.rejected,(state,action)=>{
            state.message = action.payload
        } )

    },
    
    });


    export const { reset, handleLoginUser, empatyMessage ,setTokenIsThere, setTokenIsNotThere} = authSlice.actions;
    export default authSlice.reducer;