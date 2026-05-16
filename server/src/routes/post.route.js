import { Router } from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middlware.js";
import { getPosts, getPost, getUserPosts, createPost, likePost, deletePost } from "../controllers/post.controller.js";

const router = Router();

// publi routes
router.get('/', getPosts);
router.get('/:postId', getPost);
router.get('/user/:username', getUserPosts);

// protected routes
router.post('/', protectedRoute, upload.single("image") , createPost);
router.post('/:postId/like', likePost);
router.delete('/:postId', deletePost); 

export default router;