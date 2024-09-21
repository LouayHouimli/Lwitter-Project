import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs';
import axios from "axios";
import FormData from "form-data";
import mongoose from 'mongoose'

export const getUserProfile = async (req, res) => {
        const { username } = req.params;
    try {
        
        const user = await User.findOne({ username }).select("-password");

        
    

        res.status(200).json(user);

    }
    catch (error) {
        console.log("error in getUserProfile from user.controller.js", error.message);
        res.status(500).json({ error: error.message });  
    }
    
}

export const followUnfollowUser = async (req, res) => {
    
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);


        if (!userToModify || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        

        if (id === currentUser._id.toString()) {
            return res.status(400).json({ message: "You cannot follow or unfollow yourself" });
        }   

        if (userToModify.followers.includes(req.user._id)) {
            await userToModify.updateOne({ $pull: { followers: req.user._id } });
            await currentUser.updateOne({ $pull: { following: id } });
            await Notification.deleteMany({ sender: req.user._id, receiver: id, type: "follow" });
            return res.status(200).json({ message: "Unfollowed successfully" });
        } else {
            await userToModify.updateOne({ $push: { followers: req.user._id } });
            await currentUser.updateOne({ $push: { following: id } });
            const newNotification = new Notification({
                sender: req.user._id,
                receiver: id,
                type: "follow",
                message: `${currentUser.username} followed you`
            });
            await newNotification.save();
            return res.status(200).json({ message: "Followed successfully" });
}
        

    } catch (error) {
        console.log("error in followUnfollowUser from user.controller.js", error.message);
        res.status(500).json({ error: error.message });
    }

}

export const getSuggestedUsers = async (req, res) => {
    try { 
        const userId = req.user._id;
        const usersFollowedByMe = await User.find(userId).select("following");
        const users = await User.aggregate([
            { $match: { _id: { $ne: userId } } },
            { $sample: { size: 10 } },
            
        ])
        const filtredUsers = users.filter(user => !usersFollowedByMe[0].following.includes(user._id));
    
        const suggestedUsers = filtredUsers.slice(0, 4);

        suggestedUsers.forEach(user => {
            user.password = null,
            user.email = null
        });
        res.status(200).json(suggestedUsers);


    }
    catch (error) {
        console.log("error in getSuggestedUsers from user.controller.js", error.message);
        res.status(500).json({ error: error.message });
    }
}
     
export const updateUserProfile = async (req, res) => {
    
    const { fullname, username, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;
    const userId = req.user._id.toString();
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Password update logic
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Current Password Is Not Correct" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
           
        }

        // Image upload logic
        if (profileImg) {
            profileImg = await uploadImage(profileImg, user.profileImg);
        }
        if (coverImg) {
            coverImg = await uploadImage(coverImg, user.coverImg);
        }

        // Update user fields
        Object.assign(user, {
            fullname: fullname || user.fullname,
            username: username || user.username,
            bio: bio || user.bio,
            link: link || user.link,
            profileImg: profileImg || user.profileImg,
            coverImg: coverImg || user.coverImg
        });

        await user.save();
        res.status(200).json({ message: "Profile Updated Successfully" });
    } catch (error) {
        console.log("error in updateUser from user.controller.js", error.message);
        res.status(500).json({ error: error.message });
    }
}
    

 export const getVerifiedUser = async (req, res) => {
     try {
         const user = await User.findById(req.user._id);
         if (!user) {
             return res.status(404).json({ message: "User not found" });
         }

         if (user.isVerified) {
             user.isVerified = false;
             res.status(200).json({ message: "Profile UnVerified Successfully" });
         } else {
             user.isVerified = true;
             res.status(200).json({ message: "Profile Verified Successfully" });

         }
        await user.save();
         
        
    }
    catch (error) {
        console.log(error)
    }
}

export const getUserFollowers = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followers = await User.find({ _id: { $in: user.followers } }).select("-password -email");
    res.status(200).json({ followers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserFollowing = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const following = await User.find({ _id: { $in: user.following } }).select("-password -email");
    res.status(200).json({ following });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function for image upload
async function uploadImage(newImage, oldImage) {
    if (oldImage) {
        await cloudinary.uploader.destroy(oldImage.split("/").pop().split(".")[0]);
    }
    const uploadedResponse = await cloudinary.uploader.upload(newImage);
    return uploadedResponse.secure_url;
}