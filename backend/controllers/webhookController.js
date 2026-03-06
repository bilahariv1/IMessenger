/**
 * WhatsApp Webhook Controller
 * Handles webhook verification and incoming webhook events from Meta/WhatsApp
 */

import Message from '../models/messageModel.js';

/**
 * GET /webhook - Webhook Verification
 * Meta sends a GET request to verify your webhook endpoint
 */
export async function verifyWebhook(req, res) {
    try {
        // Parse params from the webhook verification request
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        console.log('Webhook Verification Request:', { mode, token, challenge });

        // Check if a token and mode were sent
        if (mode && token) {
            // Check the mode and token sent are correct
            if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
                // Respond with 200 OK and challenge token from the request
                console.log('✅ Webhook verified successfully');
                return res.status(200).send(challenge);
            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                console.error('❌ Webhook verification failed: Invalid verify token');
                return res.sendStatus(403);
            }
        }

        // Return 400 Bad Request if mode/token missing
        console.error('❌ Webhook verification failed: Missing parameters');
        return res.sendStatus(400);

    } catch (error) {
        console.error('Error in webhook verification:', error);
        return res.sendStatus(500);
    }
}

/**
 * POST /webhook - Receive Webhook Events
 * Receives and processes incoming webhook notifications from WhatsApp
 */
export async function handleWebhook(req, res) {
    try {
        const body = req.body;

        console.log('📩 Incoming webhook:', JSON.stringify(body, null, 2));

        // Check if this is a WhatsApp webhook event
        if (body.object !== 'whatsapp_business_account') {
            console.log('Not a WhatsApp Business webhook event');
            return res.sendStatus(404);
        }

        // Process webhook entries
        if (body.entry && Array.isArray(body.entry)) {
            for (const entry of body.entry) {
                // Get the webhook event changes
                const changes = entry.changes;

                if (changes && Array.isArray(changes)) {
                    for (const change of changes) {
                        console.log('Webhook change field:', change.field);

                        // WhatsApp commonly sends both incoming messages and status updates
                        // under field === 'messages'.
                        if (change.field === 'messages') {
                            await handleMessagesEvent(change.value);
                            await handleMessageStatusEvent(change.value);
                        }
                        // Handle message status updates
                        else if (change.field === 'message_status') {
                            await handleMessageStatusEvent(change.value);
                        }
                        // Log other event types
                        else {
                            console.log('Unhandled webhook field:', change.field);
                        }
                    }
                }
            }
        }

        // Return a '200 OK' response to acknowledge receipt of the event
        return res.status(200).send('EVENT_RECEIVED');

    } catch (error) {
        console.error('Error handling webhook:', error);
        // Still return 200 to prevent Meta from retrying
        return res.status(200).send('ERROR');
    }
}

/**
 * Process incoming messages from WhatsApp
 */
async function handleMessagesEvent(value) {
    try {
        console.log('Processing messages event:', JSON.stringify(value, null, 2));

        // Extract metadata
        const metadata = value.metadata;
        const contacts = value.contacts;
        const messages = value.messages;

        if (!messages || !Array.isArray(messages)) {
            console.log('No messages in webhook event');
            return;
        }

        // Process each message
        for (const message of messages) {
            // Get contact info
            const contact = contacts?.find(c => c.wa_id === message.from);
            const senderName = contact?.profile?.name || 'Unknown';

            console.log(`📨 New message from ${senderName} (${message.from})`);

            // Extract message content based on type
            let messageText = '';
            let messageType = message.type;

            switch (message.type) {
                case 'text':
                    messageText = message.text.body;
                    break;
                case 'image':
                    messageText = message.image.caption || '[Image]';
                    break;
                case 'video':
                    messageText = message.video.caption || '[Video]';
                    break;
                case 'audio':
                    messageText = '[Audio]';
                    break;
                case 'document':
                    messageText = message.document.filename || '[Document]';
                    break;
                case 'location':
                    messageText = `[Location: ${message.location.latitude}, ${message.location.longitude}]`;
                    break;
                case 'contacts':
                    messageText = '[Contact Card]';
                    break;
                case 'sticker':
                    messageText = '[Sticker]';
                    break;
                case 'button':
                    messageText = message.button.text;
                    break;
                case 'interactive':
                    if (message.interactive.type === 'button_reply') {
                        messageText = message.interactive.button_reply.title;
                    } else if (message.interactive.type === 'list_reply') {
                        messageText = message.interactive.list_reply.title;
                    }
                    break;
                default:
                    messageText = `[Unsupported message type: ${message.type}]`;
            }

            // Save message to database
            try {
                const newMessage = new Message({
                    from: message.from,
                    phoneNumber: message.from, // Alias field
                    name: senderName,
                    senderName: senderName, // Alias field
                    message: messageText,
                    messageType: messageType,
                    timestamp: new Date(parseInt(message.timestamp) * 1000),
                    messageId: message.id,
                    status: 'received',
                    metadata: {
                        whatsappMessageId: message.id,
                        context: message.context, // Reply context if this is a reply
                        referral: message.referral, // Referral info if user came from ad
                    },
                    // Store raw webhook value so payload can be viewed later in UI.
                    incomingPayload: value
                });

                await newMessage.save();
                console.log('✅ Message saved to database:', newMessage._id);

            } catch (dbError) {
                console.error('Error saving message to database:', dbError);
            }

            // Auto-reply logic (optional - you can customize this)
            // await sendAutoReply(message.from, senderName);
        }

    } catch (error) {
        console.error('Error processing messages event:', error);
    }
}

/**
 * Process message status updates (sent, delivered, read, failed)
 */
async function handleMessageStatusEvent(value) {
    try {
        console.log('Processing message status event:', JSON.stringify(value, null, 2));

        const statuses = value.statuses;

        if (!statuses || !Array.isArray(statuses)) {
            console.log('No statuses in webhook event');
            return;
        }

        // Process each status update
        for (const status of statuses) {
            console.log(`📊 Message ${status.id} status: ${status.status}`);

            // Update message status in database
            try {
                const result = await Message.updateOne(
                    { 'metadata.whatsappMessageId': status.id },
                    {
                        $set: {
                            status: status.status,
                            'metadata.statusTimestamp': new Date(parseInt(status.timestamp) * 1000)
                        }
                    }
                );

                if (result.matchedCount > 0) {
                    console.log(`✅ Updated message status to: ${status.status}`);
                } else {
                    console.log('Message not found in database for status update');
                }

            } catch (dbError) {
                console.error('Error updating message status in database:', dbError);
            }
        }

    } catch (error) {
        console.error('Error processing message status event:', error);
    }
}

/**
 * Optional: Send an auto-reply to incoming messages
 */
async function sendAutoReply(phoneNumber, senderName) {
    try {
        // Import whatsappService dynamically to avoid circular dependencies
        const { sendTextMessage } = await import('../services/whatsappService.js');
        
        const replyText = `Hello ${senderName}! Thank you for your message. We'll get back to you soon.`;
        
        await sendTextMessage(phoneNumber, replyText);
        console.log('✅ Auto-reply sent');
        
    } catch (error) {
        console.error('Error sending auto-reply:', error);
    }
}
