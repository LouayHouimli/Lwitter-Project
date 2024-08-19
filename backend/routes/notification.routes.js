import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getAllNotifications } from "../controllers/notification.controller.js"
import { deleteAllNotifications } from "../controllers/notification.controller.js"
import {deleteNotification} from "../controllers/notification.controller.js"

const router = express.Router();



router.get("/", protectRoute, getAllNotifications)
router.delete("/delete/:id", protectRoute, deleteNotification)
router.delete("/deleteAll",protectRoute, deleteAllNotifications)


export default router;