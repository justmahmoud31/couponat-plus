import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // await mongoose.connect(
    //   "mongodb+srv://justMahmoud:Mahmoud3152003@cluster0.hua85.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    // );
    await mongoose.connect("mongodb://0.0.0.0:27017/coupons");
    console.log("✅ Database Connected");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1);
  }
};
