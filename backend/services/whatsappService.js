import axios from 'axios';

const WHATSAPP_API_URL = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

/**
 * Send a text message via WhatsApp
 */
export async function sendTextMessage(to, messageText) {
    try {
        const response = await axios.post(
            WHATSAPP_API_URL, {
                messaging_product: 'whatsapp',
                to: to,
                type: 'text',
                text: {
                    body: messageText
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            success: true,
            messageId: response.data.messages[0].id,
            data: response.data
        };
    } catch (error) {
        console.error('WhatsApp API Error:', error.response ?.data || error.message);
        throw new Error(error.response ?.data ?.error ?.message || 'Failed to send WhatsApp message');
    }
}

/**
 * Send a template message via WhatsApp
 */
export async function sendTemplateMessage(to, templateName, parameters = []) {
    try {
        const response = await axios.post(
            WHATSAPP_API_URL, {
                messaging_product: 'whatsapp',
                to: to,
                type: 'template',
                template: {
                    name: templateName,
                    language: {
                        code: 'en_US'
                    },
                    components: [{
                        type: 'body',
                        parameters: parameters.map(text => ({
                            type: 'text',
                            text: text
                        }))
                    }]
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            success: true,
            messageId: response.data.messages[0].id,
            data: response.data
        };
    } catch (error) {
        console.error('WhatsApp API Error:', error.response ?.data || error.message);
        throw new Error(error.response ?.data ?.error ?.message || 'Failed to send WhatsApp template');
    }
}

/**
 * Format phone number for WhatsApp (remove + and spaces)
 */
export function formatPhoneNumber(phone) {
    return phone.replace(/[^\d]/g, '');
}
