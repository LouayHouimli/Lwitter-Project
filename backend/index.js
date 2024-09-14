import express from 'express'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import bookmarksRoutes from './routes/bookmarks.routes.js'
import settingsRoutes from './routes/settings.routes.js'
import dotenv from 'dotenv'
import connectMongoDB from './db/connectDB.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { v2 as cloudinary } from 'cloudinary'

dotenv.config()

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    }); 


const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser())


app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/bookmarks", bookmarksRoutes)
app.use("/api/settings", settingsRoutes)


app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`)
    connectMongoDB()
})