import mongoose from 'mongoose';

export async function connectDB() {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imessenger';
        
        await mongoose.connect(mongoURI);
        
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
}

export default connectDB;
