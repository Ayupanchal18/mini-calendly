import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        console.log("MONGO_URI", MONGO_URI);
        const conn = await mongoose.connect(MONGO_URI, {
            dbName: "mini-calendly"
        })
    } catch (error) {
        console.log("Error connecting to database", error)
    }
}

export default connectDB;