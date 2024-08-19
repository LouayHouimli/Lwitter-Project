import mongoose from "mongoose";



const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["like", "comment", "follow"]
    },
    read: {
        type: Boolean,
        default: false
    },
    message: {
        type: String
    }



}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;