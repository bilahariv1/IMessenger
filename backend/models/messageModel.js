import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        // Alias for 'from' to support webhook data
    },
    name: {
        type: String,
        required: true,
    },
    senderName: {
        type: String,
        // Alias for 'name' to support webhook data
    },
    message: {
        type: String,
        required: true,
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'video', 'audio', 'document', 'location', 'contacts', 'sticker', 'button', 'interactive', 'template', 'unknown'],
        default: 'text',
    },
    messageId: {
        type: String,
        // WhatsApp message ID from webhook
    },
    status: {
        type: String,
        enum: ['received', 'sent', 'delivered', 'read', 'failed', 'pending'],
        default: 'received',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    label: {
        type: String,
        default: '',
    },
    metadata: {
        whatsappMessageId: String,
        context: mongoose.Schema.Types.Mixed, // Reply context
        referral: mongoose.Schema.Types.Mixed, // Referral info from ads
        statusTimestamp: Date,
    },
    incomingPayload: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    replies: [{
        text: String,
        timestamp: {
            type: Date,
            default: Date.now,
        },
        whatsappMessageId: String,
        status: {
            type: String,
            enum: ['sent', 'failed', 'pending'],
            default: 'pending'
        },
        error: String,
        templateName: String,
        parameters: [String],
        whatsappApiResponse: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        }
    }, ],
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;