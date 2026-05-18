import asyncHandler from "express-async-handler";
import Notification from "../models/notification.model.js";
import { getAuth } from "@clerk/express";
import Post from "../models/post.model.js";


export const getNotifications = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const notifications = await Notification.find({ to: userId })
        .sort({ createdAt: -1 })
        .populate("from", "firstname lastname username profilePicture")
        .populate("post", "content")
        .populate("comment", "content")

    res.status(200).json({ notifications });
});

export const deleteNotification = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const notificationId = req.params.notificationId;

    if (notification.to.toString() !== user._id.toString()) {
        return res.status(403).json({ error: "You are not authorized to delete this notification" });
    }

    const notification = await Notification.findByIdAndDelete({
        _id: notificationId,
        to: user._id
    });

    if (!notification) return res.status(404).json({ error: "Notification not found" });

    res.status(200).json({ message: "Notification deleted successfully" });


});
