import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MOGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB connected successfully !!`);
    } catch (error) {
        console.log("MongoDB connection error");
        process.exit(-1);
    }
}

export {connectDB};