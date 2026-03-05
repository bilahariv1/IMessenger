import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import Message from './models/messageModel.js';
import connectDB from './config/db.js';

dotenv.config();

async function seedDatabase() {
    try {
        await connectDB();

        // Clear existing messages
        await Message.deleteMany({});
        console.log('Cleared existing messages');

        // Read mock data
        const mockFilePath = path.resolve('mock', 'mockMessages.json');
        let data = await fs.readFile(mockFilePath, 'utf-8');

        // Strip UTF-8 BOM if present
        if (data.charCodeAt(0) === 0xFEFF) {
            data = data.slice(1);
        }

        const mockMessages = JSON.parse(data);

        // Insert messages
        const result = await Message.insertMany(mockMessages);
        console.log(`✓ Successfully seeded ${result.length} messages to MongoDB`);

        // Display inserted messages
        const allMessages = await Message.find();
        console.log('Messages in database:', JSON.stringify(allMessages, null, 2));

        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seedDatabase();