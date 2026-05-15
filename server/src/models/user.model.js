import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: { 
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    location: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: '',
        maxLength: 200
    },
    bannerImage: {
        type: String,
        default: ''
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;

        