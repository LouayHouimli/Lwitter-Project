import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { getBookmarks } from '../controllers/bookmarks.controller.js'

const router = express.Router()

router.get('/getbookmarks', protectRoute, getBookmarks)

export default router