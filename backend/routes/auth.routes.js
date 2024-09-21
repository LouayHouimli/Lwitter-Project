import express from 'express'
import { signup, login, logout, getMe, refreshToken } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/protectRoute.js'
const router = express.Router();

router.get("/me", protectRoute, getMe)
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.post("/refresh", refreshToken)

router.get("/test-auth", protectRoute, (req, res) => {
    res.json({ message: "You are authenticated", user: req.user });
});

export default router;