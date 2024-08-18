import express from 'express'
import authRoutes from './routes/auth.routes.js'
import dotenv from 'dotenv'
import connectMongoDB from './db/connectDB.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()


const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser())
app.use("/api/auth", authRoutes)


app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`)
    connectMongoDB()
})