import { Router } from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getUserProfile, updateUserProfile, syncProfile, getCurrentUser, followUser } from "../controllers/user.controller.js";

const router = Router();

// public route
router.get('/getUserProfile/:username', getUserProfile);


// protected routes
router.put('/updateUserProfile', protectedRoute, updateUserProfile);
router.post('/sync', protectedRoute, syncProfile)
router.post('/profile', protectedRoute, getCurrentUser)
router.post('/following', protectedRoute, followUser)

export default router;