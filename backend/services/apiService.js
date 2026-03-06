import Message from '../models/messageModel.js';
import * as whatsappService from './whatsappService.js';

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
        // Find the message
        const message = await Message.findById(messageId);

        if (!message) {
            throw new Error('Message not found');
        }

        // Send via WhatsApp API
        const whatsappResponse = await whatsappService.sendTextMessage(
            whatsappService.formatPhoneNumber(message.from),
            replyText
        );

        // Save reply to database
        const updatedMessage = await Message.findByIdAndUpdate(
            messageId, {
                $push: {
                    replies: {
                        text: replyText,
                        timestamp: new Date(),
                        whatsappMessageId: whatsappResponse.messageId,
                        status: 'sent',
                        whatsappApiResponse: whatsappResponse.data
                    }
                }
            }, { new: true }
        );

        return {
            success: true,
            message: updatedMessage,
            whatsappResponse: whatsappResponse
        };
    } catch (err) {
        console.error('sendReply error', err);

        // Save failed reply to database
        try {
            await Message.findByIdAndUpdate(
                messageId, {
                    $push: {
                        replies: {
                            text: replyText,
                            timestamp: new Date(),
                            status: 'failed',
                            error: err.message
                        }
                    }
                }
            );
        } catch (dbErr) {
            console.error('Failed to save error to database:', dbErr);
        }

        throw err;
    }
}

export async function sendBulkReply(messageIds, replyText) {
    try {
        const results = [];
        const messages = await Message.find({ _id: { $in: messageIds } });

        for (const message of messages) {
            try {
                // Send via WhatsApp API
                const whatsappResponse = await whatsappService.sendTextMessage(
                    whatsappService.formatPhoneNumber(message.from),
                    replyText
                );

                // Save reply to database
                await Message.findByIdAndUpdate(
                    message._id, {
                        $push: {
                            replies: {
                                text: replyText,
                                timestamp: new Date(),
                                whatsappMessageId: whatsappResponse.messageId,
                                status: 'sent',
                                whatsappApiResponse: whatsappResponse.data
                            }
                        }
                    }
                );

                results.push({
                    messageId: message._id,
                    success: true,
                    whatsappMessageId: whatsappResponse.messageId
                });
            } catch (err) {
                console.error(`Failed to send to ${message.from}:`, err.message);

                // Save failed reply
                await Message.findByIdAndUpdate(
                    message._id, {
                        $push: {
                            replies: {
                                text: replyText,
                                timestamp: new Date(),
                                status: 'failed',
                                error: err.message
                            }
                        }
                    }
                );

                results.push({
                    messageId: message._id,
                    success: false,
                    error: err.message
                });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const failedCount = results.filter(r => !r.success).length;

        return {
            success: true,
            results: results,
            summary: {
                total: results.length,
                sent: successCount,
                failed: failedCount
            }
        };
    } catch (err) {
        console.error('sendBulkReply error', err);
        throw err;
    }
}

/**
 * Send a WhatsApp template message
 */
export async function sendTemplateMessage(messageId, templateName, parameters) {
    try {
        // Find the message
        const message = await Message.findById(messageId);

        if (!message) {
            throw new Error('Message not found');
        }

        // Send via WhatsApp API
        const whatsappResponse = await whatsappService.sendTemplateMessage(
            whatsappService.formatPhoneNumber(message.from),
            templateName,
            parameters
        );

        // Save reply to database
        const updatedMessage = await Message.findByIdAndUpdate(
            messageId, {
                $push: {
                    replies: {
                        text: `Template sent: ${templateName}`,
                        timestamp: new Date(),
                        whatsappMessageId: whatsappResponse.messageId,
                        templateName: templateName,
                        parameters: parameters,
                        status: 'sent',
                        whatsappApiResponse: whatsappResponse.data
                    }
                }
            }, { new: true }
        );

        return {
            success: true,
            message: updatedMessage,
            whatsappResponse: whatsappResponse
        };
    } catch (err) {
        console.error('sendTemplateMessage error', err);
        throw err;
    }
}