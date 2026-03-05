import Message from '../models/messageModel.js';

export async function fetchMessages() {
    try {
        const messages = await Message.find().sort({ timestamp: -1 });
        return messages;
    } catch (err) {
        console.error('fetchMessages error', err);
        throw err;
    }
}

export async function sendReply(messageId, replyText) {
    try {
        // Find the message and add reply to it
        const message = await Message.findByIdAndUpdate(
            messageId, {
                $push: {
                    replies: {
                        text: replyText,
                        timestamp: new Date()
                    }
                }
            }, { new: true }
        );
        return { success: true, message };
    } catch (err) {
        console.error('sendReply error', err);
        throw err;
    }
}

export async function sendBulkReply(messageIds, replyText) {
    try {
        const result = await Message.updateMany({ _id: { $in: messageIds } }, {
            $push: {
                replies: {
                    text: replyText,
                    timestamp: new Date()
                }
            }
        });
        return { success: true, modifiedCount: result.modifiedCount };
    } catch (err) {
        console.error('sendBulkReply error', err);
        throw err;
    }
}