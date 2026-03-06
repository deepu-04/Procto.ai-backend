import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is undefined. Check .env file");
    }

    const conn = await mongoose.connect(mongoUri, {
      dbName: "ai-proctor", 
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed ");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
