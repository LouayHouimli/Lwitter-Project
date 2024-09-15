import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectMod = async (req, res, next) => {

    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "No Token Provided" });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({ message: "Invalid Token" });
        }   

        const user = await userModel.findById(verified.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }  
        if (!user.isMod) {
            return res.status(404).json({ message: "User is not a mod" });
        }   
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in middleware", error);
        res.status(401).json({ message: "Internal Sever Error" });
    }

     }