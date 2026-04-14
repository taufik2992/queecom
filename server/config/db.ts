import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("Connected", () => {
    console.log("MongoDB connected successfully");
  });
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export default connectDB;
