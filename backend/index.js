import dotenv from 'dotenv';
dotenv.config(); // This should be the first line

console.log("All environment variables:", Object.keys(process.env));
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY); // Debugging line

import express from 'express'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import bookmarksRoutes from './routes/bookmarks.routes.js'
import settingsRoutes from './routes/settings.routes.js'
import modRoutes from './routes/mod.routes.js'
import connectMongoDB from './db/connectDB.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { v2 as cloudinary } from 'cloudinary'
import paymentRoutes from './routes/payment.routes.js'
import webhookRoutes from './routes/webhook.routes.js'
import requestLogger from './middleware/requestLogger.js'
import dbLogger from './middleware/dbLogger.js'

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    }); 


const app = express()
const PORT = process.env.PORT || 5000

// This should be before any middleware that parses the body
app.use("/api/webhook", webhookRoutes);

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(cookieParser())

// Add the logging middlewares
app.use(requestLogger);
app.use(dbLogger);

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/bookmarks", bookmarksRoutes)
app.use("/api/settings", settingsRoutes)
app.use("/api/mod", modRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/webhook", webhookRoutes)


app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`)
    connectMongoDB()
})