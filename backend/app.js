import './env.js'; // Load environment variables first
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import messageRoutes from './routes/messageRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Connect to MongoDB
connectDB();

// Webhook routes (must be before other API routes)
app.use('/api', webhookRoutes);

// API routes
app.use('/api', messageRoutes);

// Serve privacy policy at a clean URL path for Meta App Settings
app.get('/privacy-policy', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/privacy-policy.html'));
});

// Also support direct .html path explicitly
app.get('/privacy-policy.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/privacy-policy.html'));
});

// Serve index.html for all unmatched routes (React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});