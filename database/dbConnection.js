import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://justMahmoud:Mahmoud3152003@cluster0.hua85.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Database Connected');
  } catch (error) {
    console.error('❌ Database Connection Failed:', error.message);
    process.exit(1);
  }
};
