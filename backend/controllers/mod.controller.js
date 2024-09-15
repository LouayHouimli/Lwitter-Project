import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const copyrightContent = async (req, res) => {
    const userId = req.user._id
    const postId = req.params.id;
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        if (!user.isMod) {
            return res.status(404).json({ message: "User is not a mod" })
        }

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }
        if (post.isCopyrighted) {
            post.isCopyrighted = false
            await post.save()
            return res.status(200).json({ message: "Post has not copyright content" })
        }
        post.isCopyrighted = true
        await post.save()
        res.status(200).json({ message: "Post has copyright content" })
        
        
    }

    catch (error) { 

        res.status(500).json({ error: error.message })
    }

}