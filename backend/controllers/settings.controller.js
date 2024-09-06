
import User from "../models/user.model.js";

export const updateTheme = async (req, res) => {
    const userId = req.user._id;
    const theme = req.body.theme;
    try {
        console.log(theme)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.Settings.Appearance = theme;
        user.save();

        res.status(200).json({ message: "Theme updated successfully" });


        
    }
    catch (error) {
        console.log(error)
    }

}