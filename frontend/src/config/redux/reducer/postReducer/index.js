import { createSlice } from '@reduxjs/toolkit';
import { getAllComments, getAllPosts } from '../../action/postAction';
const initialState = {
    posts: [],
    loggedIn: false,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",    
    postFetched: false,
    comments: [],
    postId:""
};  


const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: ()=> initialState,
        empatyMessage: (state) => {
            state.message = "";
    },
        resetPostId: (state) => {
            state.postId = "";
            console.log(state.postId);
        }
    },

    extraReducers: (builder) => {   
        builder
        .addCase(getAllPosts.pending, (state) => {
            state.isLoading = true;
            state.message = "Fetching Posts...";
        })
        .addCase(getAllPosts.fulfilled, (state, action) => {
            state.isLoading = false;        
            state.isError = false;
            state.isSuccess = true;
            state.posts = action.payload.posts.reverse();
            state.postFetched = true;
            state.message = "Posts Fetched Successfully !"
        })
        .addCase(getAllPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getAllComments.fulfilled, (state, action) => {
            state.postId = action.payload.post_id;
            state.comments = action.payload.comments
        }) 
    },
    
    }); 

export const { empatyMessage, reset, resetPostId } = postSlice.actions;

export default postSlice.reducer;