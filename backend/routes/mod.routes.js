import express from 'express'
import { protectMod } from '../middleware/protectMod.js'
import { copyrightContent } from '../controllers/mod.controller.js'

const router = express.Router()


router.post("/copyrightContent/:id", protectMod, copyrightContent)


export default router