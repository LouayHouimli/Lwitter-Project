import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import cloudinary from "cloudinary";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
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
            text : text ,
            img : img ,
        });
           
        await newPost.save();
        console.log(img,text)
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

        if (post.user.toString() !== userId) {
            return res.status(401).json({ message: "You can only delete your own posts" });
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
            res.status(200).json({ message: "Post unliked successfully" });
            await Notification.deleteMany({ sender: userId, receiver: post.user, type: "like" });
        } else {
            await post.updateOne({ $push: { likes: userId } });
            await user.updateOne({ $push: { likedPosts: postId } });
            if (user._id.toString() !== post.user.toString()) {
            const newNotification = new Notification({
                receiver: post.user,
                sender: userId,
                type: "like",
                message: `${user.username} liked your post`
            })
                
                await newNotification.save();
                 }
            res.status(200).json({ message: "Post liked successfully" });   
            


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
            user: userId
        }

        await post.updateOne({ $push: { comments: newComment } });
        if (post.user.toString() !== userId) {
            const newNotification = new Notification({
            receiver: post.user,
            sender: userId,
            type: "comment",
            message: `${user.username} commented your post`,
            content: `${text}`
            })
            await newNotification.save();
        }
        
        
        res.status(200).json({ message: "Comment created successfully" });


        

    }
    catch (error) {
        console.log("error in commentOnPost from post.controller.js", error.message);
        res.status(500).json({ error: error.message });
    }
}  
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
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        });
        res.status(200).json(posts);
        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }
    }
    catch (error) {
        console.log("error in getAllPosts from post.controller.js", error.message);
       
    }

}
export const getLikedPosts = async (req, res) => { 
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const posts = await Post.find({ likes: { $in: [userId] } }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "fullname username profileImg",
        }).populate({
            path: "comments.user",
            select: "fullname username profileImg",
        })

        if (posts.length === 0) {
            return res.status(404).json([]);
        }

        res.status(200).json(posts);

        

    }
    catch (error) {
        console.log("error in getLikedPosts from post.controller.js", error.message);
        res.status(500).json({ error: error.message });
    }


}
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
            return res.status(404).json([]);
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
        const posts = await Post.findOne({ user: user._id }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "fullname username profileImg",
        }).populate({
            path: "comments.user",
            select: "fullname username profileImg",
        })
        if (posts === null) {
            return res.status(404).json([]);
        }
        res.status(200).send(posts);
        
    }
    catch (error) {
        console.log("error in getUserPosts from post.controller.js", error.message);
        res.status(500).json({ error: error.message });
    }
}