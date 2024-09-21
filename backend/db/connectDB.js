import mongoose from "mongoose";

// Copyright (c) 2024 Lwitter Project

const connectDB = async () => {
    try {   
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected: ', conn.connection.host);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);  
        process.exit(1);
    }
}
export default connectDB;