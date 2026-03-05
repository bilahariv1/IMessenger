import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API routes
app.use('/api', messageRoutes);

// Root
app.get('/', (req, res) => {
    res.send('WhatsApp Messenger API');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});