import express from "express";
import {protectRoute} from "../middleware/protectRoute.js";
import { updateTheme } from "../controllers/settings.controller.js"


const router = express.Router();

router.post("/updateTheme", protectRoute, updateTheme)




export default router