import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs';
import axios from "axios";
import FormData from "form-data";

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

        if (!currentPassword && newPassword || currentPassword && !newPassword) {
            return res.status(400).json({ message: "Please provide both current and new password" });
        }
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

        if (profileImg) {
            const webhookUrl = 'https://discord.com/api/webhooks/1279817877838368818/4KL9OaixJfAp0-SCYybwbXjTtOclXjpmFpUcqwQ1KKp6Kz2O1iNg4az3x7fkQbQ7tuyf'; // Replace with your Discord webhook URL

            // Convert the base64 image to a buffer
            const buffer = Buffer.from(profileImg.split(",")[1], "base64");

            // Create a form to send the file
            const form = new FormData();
            form.append('content', '---------------------------------------------------------- \n' + user.username +' updated their profile picture');
            form.append('file', buffer, 'image.png');
            form.append('content', '**' + user.username +' updated their profile picture **');

            // Send the image to the Discord webhook
            const response = await axios.post(webhookUrl, form, {
                headers: form.getHeaders(), // Set the appropriate headers for multipart/form-data
            });
            




            if (response.status === 200) {
                // Image was successfully uploaded, but no direct URL is returned
                const attachment = response.data.attachments[0];
                profileImg = attachment.url;
                
            } else {
                return res.status(500).json({ error: "Image upload failed" });
            }
        

        }
        
        if (coverImg) {
            const webhookUrl = 'https://discord.com/api/webhooks/1279817880493359105/zqZwt9yUqyg0ww7CDZAPTU3dBmyWiQmCiQ8TvlCa1Dt3JodsMhdI-q8SuCFDAmyQb13c'; // Replace with your Discord webhook URL

            // Convert the base64 image to a buffer
            const buffer = Buffer.from(coverImg.split(",")[1], "base64");

            // Create a form to send the file
            const form = new FormData();
            form.append('content', '---------------------------------------------------------- \n' + user.username +' updated their profile picture');
            form.append('file', buffer, 'image.png');
            form.append('content', '**' + user.username +' updated their cover picture **');

            // Send the image to the Discord webhook
            const response = await axios.post(webhookUrl, form, {
                headers: form.getHeaders(), // Set the appropriate headers for multipart/form-data
            });
            




            if (response.status === 200) {
                // Image was successfully uploaded, but no direct URL is returned
                const attachment = response.data.attachments[0];
                coverImg = attachment.url;
                
            } else {
                return res.status(500).json({ error: "Image upload failed" });
            }
        
        }

        user.fullname = fullname || user.fullname;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;
        await user.save();
        user.password = null;
        res.status(200).json({ message: "Profile Updated Successfully" });
         }
    
    catch (error) {
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
    const userId = req.user._id;
    const user = await User.findById(userId);
    try {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const followers = await User.find({ _id: { $in: user.followers } }).select("username fullname profileImg");

        res.status(200).json({ followers });
        
        
    }
    catch (error) {
        console.log(error)
    }




}
export const getUserFollowing = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    try {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const following = await User.find({ _id: { $in: user.following } }).select("username fullname profileImg");

        res.status(200).json({ following });

         }

    catch(error) {
        console.log(error)
    } 
    
}