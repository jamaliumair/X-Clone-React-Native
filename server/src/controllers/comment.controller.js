import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";


export const getComments = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const comments = await Comment.find({ post: postId })
        .sort({ createdAt: -1 })
        .populate("user", "firstname lastname username profilePicture")

    res.status(200).json({ comments });
});


export const createComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const { userId } = getAuth(req);

    if (!content || content.trim() === "") {
        return res.status(400).json({ error: "Comment content is required" });
    }

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!post || !user) return res.status(404).json({ error: "Post or user not found" });

    const comment = await Comment.create({
        post: postId,
        user: user._id,
        content
    })

    await Post.findByIdAndUpdate(postId,
        {
            $push: { comments: comment._id }
        });

    if (post.user._id.toString() !== user._id.toString()) {
        await Notification.create({
            from: user._id,
            to: post.user,
            type: "comment",
            post: postId,
            comment: comment._id,
        });
    }

    res.status(201).json({ comment });
});



export const deleteComment = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const commentId = req.params.commentId;

    const comment = await Comment.findById(commentId);
    const user = await User.findOne({ clerkId: userId });

    if (!comment || !user) return res.status(404).json({ error: "Comment or user not found" });

    if (comment.user.toString() !== user._id.toString()) {
        return res.status(403).json({ error: "You are not authorized to delete this comment" });
    }

    await Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: commentId }
    });

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "Comment deleted successfully" });

});