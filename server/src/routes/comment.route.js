import { Router } from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getComments, createComment, deleteComment } from "../controllers/comment.controller.js";


const router = Router();

// public routes
router.get('/post/:postId', getComments);

// protected routes
router.post('/post/:postId', protectedRoute, createComment);
router.delete('/:commentId', deleteComment);

export default router;