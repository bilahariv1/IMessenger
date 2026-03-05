import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    label: {
        type: String,
        default: '',
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
        parameters: [String]
    }, ],
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;