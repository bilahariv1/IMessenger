import Message from '../models/messageModel.js';
import fs from 'fs/promises';
import path from 'path';

const mockFilePath = path.resolve('mock', 'mockMessages.json');

export async function fetchMessages() {
    try {
        // Read from local mock file for now
        let data = await fs.readFile(mockFilePath, 'utf-8');
        // strip UTF-8 BOM if present
        if (data.charCodeAt(0) === 0xFEFF) {
            data = data.slice(1);
        }
        const messages = JSON.parse(data).map(msg => new Message(msg));
        return messages;
    } catch (err) {
        console.error('fetchMessages error', err);
        throw err;
    }
}

export async function sendReply(messageId, replyText) {
    // Simulate sending reply (log or store in memory)
    return { success: true, messageId, replyText };
}

export async function sendBulkReply(messageIds, replyText) {
    // Simulate sending bulk reply

    return { success: true, messageIds, replyText };
}