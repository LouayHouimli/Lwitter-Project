// Copyright (c) 2024 Lwitter Project

import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import cloudinary from "cloudinary";
import axios from "axios";
import FormData from "form-data";
import sharp from "sharp";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body; // Base64 encoded image string
        const userId = req.user._id.toString();

        if (!userId) {
            return res.status(401).json({ message: "User not found" });
        }

        if (!text && !img) {
            return res.status(400).json({ message: "Text or Image is required" });
        }

        if (img) {

            const uploadedResponse = await cloudinary.v2.uploader.upload(img)
            img = uploadedResponse.url

        }

        const newPost = new Post({
            user: userId,
            text: text,
            img: img,
        });

        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        console.log("error in createPost from post.controller.js", error.message);
        res.status(500).json({ error: error.message });
    }
}
export const deletePost = async (req, res) => {

    const postId = req.params.id;
    const userId = req.user._id.toString();
    try {
        const user = await User.findById(userId);
        const post = await Post.findById(postId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== userId && !user.isMod ) {
            return res.status(401).json({ message: "You can only delete your own posts or by mods" });
        }


        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.v2.uploader.destroy(imgId);    
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: "Post deleted successfully" });



    }
    catch (error) {
        console.log("error in deletePost from post.controller.js", error.message);
        res.status(500).json({ error: error.message });
    }


} 
export const likeUnlikePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id.toString();
    
    try {
        const user = await User.findById(userId);
        const post = await Post.findById(postId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.likes.includes(userId)) {
            await post.updateOne({ $pull: { likes: userId } });
             await user.updateOne({ $pull: { likedPosts: postId } });
            const updatedLikes = post.likes.pull(userId);
            await Notification.deleteMany({ sender: userId, receiver: post.user, type: "like" });
    return res.status(200).json(updatedLikes);
} else {
            await post.updateOne({ $push: { likes: userId } });
              await user.updateOne({ $push: { likedPosts: postId } });
            post.likes.push(userId);
             if (user._id.toString() !== post.user.toString()) {
                 const newNotification = new Notification({
                receiver: post.user,
                sender: userId,
                type: "like",
                message: `${user.username} liked your post`
                 })
                   await newNotification.save();
            }
            return res.status(200).json(post.likes); // Make sure this is an array
            
            
}

        
         }
        catch (error) {
            console.log("error in likeUnlikePost from post.controller.js", error.message);
            res.status(500).json({ error: error.message });
    }
    
}  
export const commentOnPost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id.toString();
  const { text } = req.body;

  try {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      text,
      user: userId,
    };

    await post.updateOne({ $push: { comments: newComment } });
    post.comments.push(newComment);

    if (post.user.toString() !== userId) {
      const newNotification = new Notification({
        receiver: post.user,
        sender: userId,
        type: "comment",
        message: `${user.username} commented on your post`,
        content: `${text}`,
      });
      await newNotification.save();
    }

   
    const updatedPost = await Post.findById(postId).populate({
      path: 'comments.user',
      select: 'username fullname isVerified isMod profileImg', 
    });

    return res.status(200).json(updatedPost.comments);
  } catch (error) {
    console.log("error in commentOnPost from post.controller.js", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const deleteComment = async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const userId = req.user._id.toString();
    try {
        const user = await User.findById(userId);
        const post = await Post.findById(postId);
        const comment = post.comments.find(comment => comment._id.toString() === commentId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.user.toString() !== userId) {
            return res.status(401).json({ message: "You can only delete your own comments" });
        }

        await post.updateOne({ $pull: { comments: { _id: commentId } } });
        await Notification.deleteMany({ sender: userId, receiver: post.user, type: "comment" });
        res.status(200).json({ message: "Comment deleted successfully" });



    }
    catch (error) {
        console.log("error in deleteComment from post.controller.js", error.message);
        res.status(500).json({ error: error.message });
    }

     

}
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            })
        .populate({
                path: "repostedFrom",
                select: "-password",
        })
        .populate({
                path: "repostedBy",
                select: "-password",
            });

        // If no posts are found, send an empty array
        if (posts.length === 0) {
            return res.status(200).json([]);
        }

        // Send the posts
        res.status(200).json(posts);

    } catch (error) {
        console.log("error in getAllPosts from post.controller.js", error.message);
        res.status(500).json({ error: error.message });
    }
};
export const getPost = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            })
        .populate({
                path: "repostedFrom",
                select: "-password",
        })
        .populate({
                path: "repostedBy",
                select: "-password",
        });
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // If no posts are found, send an empty array
        if (post.length === 0) {
            return res.status(200).json([]);
        }

        // Send the posts
        res.status(200).json(post);

    } catch (error) {
        console.log("error in getPost from post.controller.js", error.message);
        res.status(500).json({ error: error.message });
    }
};
export const getLikedPosts = async (req, res) => { 
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const posts = await Post.find({ likes: { $in: [userId] } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password -email",
            })
            .populate({
                path: "comments.user",
                select: "password -email",
            });

        if (posts.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(posts);

    } catch (error) {
        console.log("Error in getLikedPosts from post.controller.js:", error.message);
        res.status(500).json({ error: error.message });
    }
};
export const getFollowingPosts = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const posts = await Post.find({ user: { $in: user.following } }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "fullname username profileImg",
        }).populate({
            path: "comments.user",
            select: "fullname username profileImg",
        })
        if (posts.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(posts);
        
    }
    catch (error) {
        console.log("error in getFollowingPosts from post.controller.js", error.message);   
        res.status(500).json({ error: error.message });
    }

}
export const getUserPosts = async (req, res) => {
    const username = req.params.username;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "fullname username profileImg isVerified isMod",
        }).populate({
            path: "comments.user",
            select: "fullname username profileImg",
        })
        if (posts === null) {
            return res.status(200).json([]);
        }
        res.status(200).send(posts);
        
    }
    catch (error) {
        console.log("error in getUserPosts from post.controller.js", error.message);
        res.status(500).json({ error: error.message });
    }
}
export const getSearchResults = async (req, res) => {
    const searchTerm = req.query.q || ""; // Extract the 'q' query parameter

    try {
        const posts = await Post.find({
            $or: [
                { text: { $regex: new RegExp(searchTerm, 'i') } },
                { 'user.username': { $regex: new RegExp(searchTerm, 'i') } },
                { 'user.fullname': { $regex: new RegExp(searchTerm, 'i') } }
            ],
        })
        .sort({ createdAt: -1 })
        .populate({
            path: "user",
            select: "fullname username profileImg",
        })
        .populate({
            path: "comments.user",
            select: "fullname username profileImg",
        });

        if (posts.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(posts);

    } catch (error) {
        console.log("error in getSearchResults from post.controller.js", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const bookMarkPost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.bookmarks.includes(userId)) {
            await post.updateOne({ $pull: { bookmarks: userId } });
            await user.updateOne({ $pull: { bookmarkedPosts: postId } });
            const updatedBookmarks = post.bookmarks.pull(userId);
            return res.status(200).json(updatedBookmarks);
            
        } else {
            await post.updateOne({ $push: { bookmarks: userId } });
            await user.updateOne ({$push : {bookmarkedPosts : postId}});
            post.bookmarks.push(userId);
            return res.status(200).json(post.bookmarks);
            
        }
        

        
    }
    catch (error) {
        console.log("error in bookMarkPost from post.controller.js", error.message);
        res.status(500).json({ error: error.message });
        
    }
    
}
export const repostPost = async (req, res) => {
  try {
    const originalPostId = req.params.id;
    const userId = req.user._id;

    const originalPost = await Post.findById(originalPostId);
    if (!originalPost) {
      return res.status(404).json({ error: "Original post not found" });
    }

    const repostedPost = new Post({
      user: originalPost.user,
      text: originalPost.text,
      img: originalPost.img,
      repostedFrom: originalPost._id,
      repostedBy: userId,
    });

    await repostedPost.save();

    // Add repost to the original post
    originalPost.reposts.push(userId);
    await originalPost.save();

    return res.status(200).json(repostedPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to repost" });
  }
};