// Copyright (c) 2024 Lwitter Project
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateTokens, verifyRefreshToken } from '../lib/utils/generateToken.js';

export const signup = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;
        if (!fullname || !username || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }
        const existingUser = await User.findOne({ username });
         const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        
        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ fullname, username, email, password: hashedPassword });
        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                bio: newUser.bio,
                followers: newUser.followers,
                follwing: newUser.following

            })   
        } else {
            res.status(400).json({ message: "Invalid user data" });
            
        }
    }
    catch (error) {
        console.log("error in singup from auth.controller.js", error.message);
        res.status(500).json({ error: error.message });
        
    }
}
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Username or password is incorrect" });
        }

        const { accessToken, refreshToken } = generateTokens(user._id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            accessToken,
            user: {
                _id: user._id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                profileImg: user.profileImg,
                coverImg: user.coverImg,
                bio: user.bio,
                followers: user.followers,
                following: user.following
            }
        });
    } catch (error) {
        console.error("Error in login:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token not found" });
        }

        const userId = verifyRefreshToken(refreshToken);
        if (!userId) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ accessToken });
    } catch (error) {
        console.error("Error in refreshToken:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('refreshToken');
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("error in getMe from auth.controller.js", error.message);
        res.status(500).json({ error: error.message });
    }
}

