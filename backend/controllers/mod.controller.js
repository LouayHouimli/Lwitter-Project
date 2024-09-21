import User from "../models/user.model.js";
import Post from "../models/post.model.js";

// Copyright (c) 2024 Lwitter Project

export const copyrightContent = async (req, res, next) => {
    try {
        const [user, post] = await Promise.all([
            User.findById(req.user._id),
            Post.findById(req.params.id)
        ]);

        if (!user?.isMod) {
            return res.status(403).json({ error: "User not authorized as a moderator" });
        }

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        post.isCopyrighted = !post.isCopyrighted;
        await post.save();

        const action = post.isCopyrighted ? 'marked' : 'unmarked';
        res.json({ 
            message: `Post has been ${action} for copyright content`,
            isCopyrighted: post.isCopyrighted
        });
    } catch (error) {
        next(error);
    }
};