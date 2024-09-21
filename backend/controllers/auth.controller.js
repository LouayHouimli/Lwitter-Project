import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';

export const signup = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;
        
        // Validate input
        if (!fullname || !username || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address" });
        }
        
        // Check for existing user
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: existingUser.email === email ? "Email already exists" : "Username already exists" });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({ fullname, username, email, password: hashedPassword });
        await newUser.save();

        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            fullname: newUser.fullname,
            email: newUser.email,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
            bio: newUser.bio,
            followers: newUser.followers,
            following: newUser.following
        });
    } catch (error) {
        console.error("Error in signup:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const login = async (req, res) => {
    try {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(!user) {
        return res.status(404).json({message: "User not found"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(401).json({message: "Username or password is incorrect"});
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
        bio: user.bio,
        followers: user.followers,
        follwing: user.following
    })
        
    }catch(error) { 
        console.log("error in login from auth.controller.js", error.message);
        res.status(500).json({ error: error.message });
    }
   

}
export const logout = async (req, res) => {
    try
    {
    res.cookie("jwt", process.env.JWT_SECRET, { maxAge: 0 });

    res.status(200).json({ message: "Logged out successfully" });
    }
    catch(error) {
        console.log("error in logout from auth.controller.js", error.message);
        res.status(500).json({ error: error.message });
    }
    
}
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

