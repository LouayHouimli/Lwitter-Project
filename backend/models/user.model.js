// Copyright (c) 2024 Lwitter Project

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },  
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        },
    ] ,  
  
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        },
    ] ,  
    profileImg: {
        type: String,
        default: "https://raw.githubusercontent.com/LouayHouimli/Lwitter-Project/main/frontend/public/avatar-placeholder.png"
    },
    coverImg: {
        type: String,
        default: "" 
    },
    bio: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    },
    likedPosts : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: []
        },
    ],
    bookmarkedPosts : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: []
        },
    ],
    repostedPosts : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: []
        },
    ],
    isVerified: {
        type: Boolean,
        default: false
    },
    isMod: {
        type: Boolean,
        default: false
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    Settings: {
        Appearance: {
            type: String,
            enum: ["retro", "dark","synthwave","valentine","lofi","lemonade"],
            default: "retro"
        }
}


}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User