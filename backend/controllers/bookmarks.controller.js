import User from "../models/user.model.js";

export const getBookmarks = async (req, res) => {
    const userId = req.user._id;

    try {
        // Find the user by their ID and populate the bookmarkedPosts with post data
        const user = await User.findById(userId).populate({
            path: "bookmarkedPosts",
            populate: {
                path: "user",
                select: "fullname username profileImg",
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user.bookmarkedPosts);
    } catch (error) {
        console.log("Error in getBookmarks from bookmarks.controller.js:", error.message);
        res.status(500).json({ error: error.message });
    }
};