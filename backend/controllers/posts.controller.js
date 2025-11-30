import {User} from "../models/users.model.js";
import {Post} from "../models/posts.model.js";

export const createPost = async(req,res)=>{
    const {token} = req.body;

    try{

        const user = await User.findOne({token:token});

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        const post = new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file != undefined ? req.file.filename:"",
            filetype: req.file != undefined ? req.file.mimetype.split("/")[1] : ""
        })

        await post.save();
        return res.status(200).json({message: "Post Created"})

    }catch(err){
        return res.json({mmessage: err.message})
    }

}


export const getAllPost = async(req,res)=>{
    try{

        const posts = await Post.find().populate('userId','name username email profilePicture');
        res.json({posts})

    }catch(err){
        return res.status(500).json({message: err.message})
    }
}


// export const deletePost = async(req,res)=>{
   
//     const {token , post_id} = req.body;
//     console.log(req.body);
//     try{
         

//         const user =  await User.findOne({token: token}).select("_id");
//         console.log(user);
//         if(!user){
//             return res.status(404).json({message: "User not found"});
//         }

//         const post = await Post.findOne({_id: post_id});
//             console.log(post);
//         if(!post){
//             return res.json(404).json({message: "Post not found"})
//         }

//         if(post.userId.toString() !== user._id.toString() ){
//             return res.status(401).json({message: "Unauthorized"});
//         }

//         await Post.deleteOne({_id: post_id});

//         res.json({message:"Post Deleted"})


//     }catch(err){
//         return res.status(500).json({message: err.message});
//     }
// }

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;
  try {
    const user = await User.findOne({ token }).select("_id");
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: post_id });
    console.log(post);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Optional: check if user owns the post
    if (post.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await Post.deleteOne({ _id: post_id });

    return res.status(200).json({ message: "Post deleted successfully" });

  } catch (err) {
    console.error("Error deleting post:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 

import mongoose from "mongoose";

export const commentPost = async (req, res) => {
  const { token, post_id, commentBody } = req.body;
  console.log("BODY:", req.body);

  try {
    // --- Validate post_id ---
    if (!post_id || !mongoose.Types.ObjectId.isValid(post_id)) {
      return res.status(400).json({ message: "Invalid or missing post_id" });
    }

    // --- Validate user ---
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // --- Validate post ---
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // --- Create comment ---
    const newComment = new Comment({
      userId: user._id,
      postId: post_id,
      body: commentBody,
    });

    await newComment.save();

    res.json({ message: "Comment added" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const get_comments_by_post = async(req,res)=>{
    const {post_id} = req.query;

    try{
        const post = await Post.find({postId: post_id})
        if(!post){
            return res.status(404).json({message: "Post not found"})
        } 

        return res.json({comments: post.comments})
    }catch(err){
        return res.status(500).json({message: err.message})
    }   
}

export const delete_comment_of_user = async(req,res)=>{
  const {token , comment_id  } = req.body;
  try{
      const user =  await User.findOne({token: token}).select("_id");
      if(!user){
          return res.status(404).json({message: "User not found"});
      }

      const post = await Post.findOne({_id: post_id});
      if(!post){
          return res.json(404).json({message: "Post not found"})
      }

      const comment = await Comment.findOne({"_id": comment_id  });
      if(!comment){
          return res.json(404).json({message: "Comment not found"})
      } 

      if(comment.userId.toString() !== user._id.toString() ){
          return res.status(401).json({message: "Unauthorized"});
      }

      await Comment.deleteOne({"_id": comment_id  }); 
      

      res.json({message:"Comment deleted"}) 

  }catch(err){
      return res.status(500).json({message: err.message});
  }
}

export const increment_like = async(req,res)=>{  
    const {post_id} = req.body;

    try{
        const post = await Post.findOne({_id: post_id});
        if(!post){
            return res.status(404).json({message: "Post not found"})
        }

        post.likes = post.likes + 1;
        await post.save();  

        return res.json({message: "Like incremented"})
    }catch(err){
        return res.status(500).json({message: err.message})
    }
}


 