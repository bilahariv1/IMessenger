import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import messageRoutes from './routes/messageRoutes.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve mock data
app.use('/mock', express.static(path.join(process.cwd(), 'mock')));

// API routes
app.use('/api', messageRoutes);

// Root
app.get('/', (req, res) => {
    res.send('WhatsApp Messenger API');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});