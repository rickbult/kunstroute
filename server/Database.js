import mongoose from "mongoose";
import "dotenv/config";  

const url = process.env.SERVER_MONGODB_URL;
console.log("Database URL:", url);  

if (!url) {
  console.error("❌ SERVER_MONGODB_URL is undefined!");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ MongoDB error:", error.message);
    process.exit(1);
  }
};

export default connectDB;