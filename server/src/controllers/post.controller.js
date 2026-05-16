import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import { getAuth } from "@clerk/express";
import upload from "../middleware/upload.middlware.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";


export const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("user", "firstname lastname username profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "firstname lastname username profilePicture"
            }
        })

    res.status(200).json({ posts });
});

export const getPost = asyncHandler(async (req, res) => {

    const postId = req.params.postId;
    const posts = await Post.findById(postId)
        .populate("user", "firstname lastname username profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "firstname lastname username profilePicture"
            }
        })

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ posts });
});

export const getUserPosts = asyncHandler(async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ error: "User not found" });
    const posts = await Post.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate("user", "firstname lastname username profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "firstname lastname username profilePicture"
            }
        })

    res.status(200).json({ posts });
});

export const createPost = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const image = req.file;
    if (!content && !image) return res.status(400).json({ error: "Content or image is required" });

    const { userId } = getAuth(req);
    const user = await User.findOne({ clerkId: userId });

    if (!user) return res.status(401).json({ error: "User not found" });

    const imageUrl = "";
    if (image) {
        try {
            const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString(
                "base64"
            )}`;

            const uploadResult = await clodinary.uploader.upload(base64Image, {
                folder: "xclone/posts",
                resource_type: "image",
                file_transformation: [
                    { width: 800, height: 800, crop: "limit" },
                    { quality: "auto" },
                    { format: "auto" }
                ]
            });

            imageUrl = uploadResult.secure_url;
        } catch (error) {
            console.error("Image upload failed:", error);
            return res.status(400).json({ error: "Failed to upload image" });
        }
    }

    const newPost = await Post.create({
        user: user._id,
        content: "" || content,
        image: imageUrl
    })

    res.status(201).json({ post: newPost });

});

export const likePost = asyncHandler(async (req, res) => {
    const userId = getAuth(req).userId;
    const postId = req.params.postId;

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user || !post) return res.status(404).json({ error: "User or post not found" });

    const isLiked = post.likes.includes(user._id);

    if (isLiked) {
        await Post.findByIdAndUpdate(postId, { $pull: { likes: user._id } });
    } else {
        await Post.findByIdAndUpdate(postId, { $push: { likes: user._id } });
    }

    if (post.user.toString() !== user._id.toString()) {
        await Notification.create({
            from: user._id,
            to: post.user,
            type: isLiked ? "unlike" : "like",
            post: postId,
        });

        res.status(200).json({
            message: isLiked ? "Post unliked successfully" : "Post liked successfully",
        });
    }
});



export const deletePost = asyncHandler(async (req, res) => {
    const userId = getAuth(req).userId;
    const postId = req.params.postId;

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user || !post) return res.status(404).json({ error: "User or post not found" });

  if (post.user.toString() !== user._id.toString()) {
    return res.status(403).json({ error: "You can only delete your own posts" });
  }

  await Post.findByIdAndDelete(postId);

  await Comment.deleteMany({ post: postId });

  res.status(200).json({ message: "Post deleted successfully" });
});
