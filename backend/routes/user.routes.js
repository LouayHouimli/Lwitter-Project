import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { getUserProfile } from '../controllers/user.controller.js'
import { followUnfollowUser } from '../controllers/user.controller.js'
import { getSuggestedUsers } from '../controllers/user.controller.js'
import { updateUserProfile } from '../controllers/user.controller.js'
import { getVerifiedUser } from '../controllers/user.controller.js'
import { getUserFollowers } from '../controllers/user.controller.js'
import { getUserFollowing } from '../controllers/user.controller.js'

const router = express.Router()

router.get("/profile/:username", protectRoute, getUserProfile)
router.get("/suggested", protectRoute, getSuggestedUsers)
router.post("/follow/:id", protectRoute, followUnfollowUser)
router.post("/update", protectRoute, updateUserProfile)
router.post("/getVerified", protectRoute, getVerifiedUser)
router.get("/followers/:username", protectRoute, getUserFollowers)
router.get("/following/:username", protectRoute, getUserFollowing)



export default router 