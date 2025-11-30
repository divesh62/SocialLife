import express from 'express';
import Router from "express";
const router = express.Router();
import {commentPost, createPost, delete_comment_of_user, deletePost, get_comments_by_post, getAllPost, increment_like} from "../controllers/posts.controller.js"
import multer from 'multer';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })



router.route("/post").post(upload.single('media'),createPost);
router.route('/posts').get(getAllPost);
router.route('/deletePost').delete(deletePost);
router.route('/comment').post(commentPost);
router.route('/get_comments').get(get_comments_by_post);
router.route('/delete_comment').delete(delete_comment_of_user);
router.route('/increment_post_like').post(increment_like);


export default router;

