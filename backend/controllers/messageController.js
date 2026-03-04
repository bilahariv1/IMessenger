import * as apiService from '../services/apiService.js';

export async function getAllMessages(req, res) {
    try {
        const messages = await apiService.fetchMessages();
        console.log("Messages: " + JSON.stringify(messages));
        res.json(messages);
    } catch (err) {
        console.log('Error');
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
}

export async function replyMessage(req, res) {
    try {
        const { messageId, replyText } = req.body;
        if (!messageId || !replyText) {
            return res.status(400).json({ error: 'Missing messageId or replyText' });
        }
        const result = await apiService.sendReply(messageId, replyText);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send reply' });
    }
}

export async function replyBulk(req, res) {
    try {
        const { messageIds, replyText } = req.body;
        if (!Array.isArray(messageIds) || !replyText) {
            return res.status(400).json({ error: 'Missing messageIds or replyText' });
        }
        const result = await apiService.sendBulkReply(messageIds, replyText);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send bulk reply' });
    }
}