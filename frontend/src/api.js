import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export async function fetchMessages() {
    const res = await axios.get(`${API_URL}/messages`);
    return res.data;
}

export async function replyMessage(messageId, replyText) {
    const res = await axios.post(`${API_URL}/reply`, { messageId, replyText });
    return res.data;
}

export async function replyBulk(messageIds, replyText) {
    const res = await axios.post(`${API_URL}/reply/bulk`, { messageIds, replyText });
    return res.data;
}

export async function sendTemplate(messageId, templateName, parameters) {
    const res = await axios.post(`${API_URL}/template`, {
        messageId,
        templateName,
        parameters
    });
    return res.data;
}