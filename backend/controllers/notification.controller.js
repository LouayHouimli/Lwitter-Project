import Notification from "../models/notification.model.js";

export const getAllNotifications = async (req, res) => {

    try {
        const notifications = await Notification.find({ receiver: req.user._id }).populate({
            path: "sender",
            select: "username fullname isVerified isMod profileImg",
        })
        await Notification.updateMany({ receiver: req.user._id }, { read: true });
        res.status(200).json(notifications);

    }
    catch (error) {
        console.log("error in getAllNotifications from notification.controller.js", error.message);
        res.status(500).json({ message: error.message });
    }
    
}
export const deleteAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({ receiver: req.user._id });
        res.status(200).json({ message: "All notifications deleted successfully" });
        
    }
    catch (error) {
        console.log("error in deleteAllNotifications from notification.controller.js", error.message);
        res.status(500).json({ message: error.message });
        
    }
    
}
export const deleteNotification = async (req, res) => {
    const notifId = req.params.id;
    try {
        const notification = await Notification.findById(notifId);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        if (notification.receiver.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "You cannot delete this notification" });
        }

        await Notification.findByIdAndDelete(notifId);
        res.status(200).json({ message: "Notification deleted successfully" });
        

    }
    catch (error) {
        console.log("error in deleteNotification from notification.controller.js", error.message);
        res.status(500).json({ message: error.message });
    }
}