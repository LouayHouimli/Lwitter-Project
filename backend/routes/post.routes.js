import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { createPost } from '../controllers/post.controller.js'
import { deletePost } from '../controllers/post.controller.js'
import { likeUnlikePost } from '../controllers/post.controller.js'
import { commentOnPost } from '../controllers/post.controller.js'
import { deleteComment } from '../controllers/post.controller.js'
import { getAllPosts } from '../controllers/post.controller.js'
import { getLikedPosts } from '../controllers/post.controller.js'
import { getFollowingPosts } from '../controllers/post.controller.js'
import { getUserPosts } from '../controllers/post.controller.js'
import { getSearchResults } from '../controllers/post.controller.js'
import { bookMarkPost } from '../controllers/post.controller.js'
import { repostPost } from '../controllers/post.controller.js'
import { getPost } from '../controllers/post.controller.js'

const router = express.Router();

router.get("/all", protectRoute, getAllPosts)
router.get("/likes/:id", protectRoute, getLikedPosts)
router.get("/following", protectRoute, getFollowingPosts)
router.get("/user/:username", protectRoute, getUserPosts)
router.post("/create-post", protectRoute, createPost)
router.delete("/delete-post/:id", protectRoute, deletePost)
router.post("/comment/:id", protectRoute, commentOnPost)
router.delete("/:postId/delete-comment/:commentId", protectRoute, deleteComment)
router.post("/like/:id", protectRoute, likeUnlikePost)
router.post("/bookmark/:id", protectRoute, bookMarkPost)
router.post("/repost/:id", protectRoute, repostPost)
router.get("/explore", protectRoute, getSearchResults);
router.get("/post/:id",protectRoute, getPost);



export default router;




