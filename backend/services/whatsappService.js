import axios from 'axios';

const WHATSAPP_API_URL = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Debug: Log WhatsApp config on module load
console.log('WhatsApp Config Loaded:');
console.log('  API_VERSION:', process.env.WHATSAPP_API_VERSION);
console.log('  PHONE_NUMBER_ID:', process.env.WHATSAPP_PHONE_NUMBER_ID);
console.log('  ACCESS_TOKEN:', ACCESS_TOKEN ? 'SET' : 'MISSING');

function ensureWhatsAppConfig() {
    if (!process.env.WHATSAPP_API_VERSION || !process.env.WHATSAPP_PHONE_NUMBER_ID || !ACCESS_TOKEN) {
        throw new Error('WhatsApp configuration missing. Check WHATSAPP_API_VERSION, WHATSAPP_PHONE_NUMBER_ID, and WHATSAPP_ACCESS_TOKEN.');
    }
}

function buildAuthHeaders() {
    return {
        'Authorization': `Bearer ${String(ACCESS_TOKEN).trim()}`,
        'Content-Type': 'application/json'
    };
}

function buildWhatsAppError(error, defaultMessage) {
    const apiErrorData = error.response?.data;
    const apiErrorMessage = apiErrorData?.error?.message || error.message || defaultMessage;
    const wrappedError = new Error(apiErrorMessage || defaultMessage);
    wrappedError.statusCode = error.response?.status;
    wrappedError.details = apiErrorData;

    if (error.response?.status === 401) {
        wrappedError.message = `WhatsApp authorization failed (401). Verify token validity/permissions and phone number ID. Meta error: ${apiErrorMessage}`;
    }

    return wrappedError;
}

/**
 * Send a text message via WhatsApp
 */
export async function sendTextMessage(to, messageText) {
    try {
        ensureWhatsAppConfig();
        
        const formattedPhone = formatPhoneNumber(to);
        
        console.log('Sending text message to:', formattedPhone);
        console.log('Message:', messageText);
        
        const response = await axios.post(
            WHATSAPP_API_URL, {
                messaging_product: 'whatsapp',
                to: formattedPhone,
                type: 'text',
                text: {
                    body: messageText
                }
            }, {
                headers: buildAuthHeaders()
            }
        );

        console.log('✅ WhatsApp API Response:', JSON.stringify(response.data, null, 2));

        return {
            success: true,
            messageId: response.data.messages[0].id,
            data: response.data
        };
        
    } catch (error) {
        console.error('WhatsApp API Error:', error.response?.data || error.message);
        throw buildWhatsAppError(error, 'Failed to send WhatsApp message');
    }
}

/**
 * Send a template message via WhatsApp
 * @param {string} to - Phone number to send to
 * @param {string} templateName - Template name (e.g., 'jaspers_market_order_confirmation_v1')
 * @param {Array} parameters - Array of parameter objects for template variables
 * @param {string} languageCode - Language code (default: 'en_US')
 */
export async function sendTemplateMessage(to, templateName, parameters = [], languageCode = 'en_US') {
    try {
        ensureWhatsAppConfig();
        
        const formattedPhone = formatPhoneNumber(to);
        
        console.log('Sending template message to:', formattedPhone);
        console.log('Template:', templateName);
        console.log('Parameters:', parameters);
        
        // Build template payload
        const templatePayload = {
            messaging_product: 'whatsapp',
            to: formattedPhone,
            type: 'template',
            template: {
                name: templateName,
                language: {
                    code: languageCode
                }
            }
        };
        
        // Only add components if parameters are provided
        if (parameters && parameters.length > 0) {
            templatePayload.template.components = [{
                type: 'body',
                parameters: parameters.map(param => {
                    // If parameter is already in correct format, use it
                    if (typeof param === 'object' && param.type && param.text) {
                        return param;
                    }
                    // Otherwise, convert string to proper format
                    return {
                        type: 'text',
                        text: String(param)
                    };
                })
            }];
        }

        const response = await axios.post(
            WHATSAPP_API_URL,
            templatePayload,
            {
                headers: buildAuthHeaders()
            }
        );

        console.log('✅ WhatsApp API Response:', JSON.stringify(response.data, null, 2));

        return {
            success: true,
            messageId: response.data.messages[0].id,
            data: response.data
        };
    } catch (error) {
        console.error('WhatsApp API Error:', error.response?.data || error.message);
        throw buildWhatsAppError(error, 'Failed to send WhatsApp template');
    }
}

/**
 * Format phone number for WhatsApp (remove + and spaces)
 */
export function formatPhoneNumber(phone) {
    return phone.replace(/[^\d]/g, '');
}