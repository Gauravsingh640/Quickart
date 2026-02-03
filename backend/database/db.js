import mongoose from "mongoose";
const connectdb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/Quickart`);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed:", error); 
  }
};

export default connectdb;