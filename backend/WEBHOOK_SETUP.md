# WhatsApp Webhook Setup Guide

This guide explains how to configure WhatsApp webhooks to receive real-time notifications of incoming messages and status updates.

## Overview

The webhook endpoint has been implemented at `/api/webhook` and handles:
- **GET requests**: Webhook verification from Meta
- **POST requests**: Incoming webhook events (messages, status updates)

## Prerequisites

1. **HTTPS Server**: Your server must use HTTPS with a valid TLS/SSL certificate (self-signed certificates are not supported)
2. **WhatsApp Business Account**: Set up through Meta Business Suite
3. **Publicly Accessible URL**: Your webhook URL must be accessible from the internet

## Step 1: Configure Environment Variables

Update your `.env` file with a secure verification token:

```env
WEBHOOK_VERIFY_TOKEN=your_secure_random_token_here_12345
```

**Important**: Replace `your_secure_random_token_here_12345` with a strong, random token (e.g., use a password generator). This token is used by Meta to verify your webhook endpoint.

## Step 2: Deploy Your Server

Your server must be accessible over HTTPS from the internet. Options include:

### Option A: Production Deployment
- Deploy to Heroku, AWS, DigitalOcean, etc.
- Ensure SSL/TLS is configured
- Note your public URL (e.g., `https://yourdomain.com`)

### Option B: Development with ngrok (Testing Only)
```bash
# Install ngrok: https://ngrok.com/download
# Run your server locally
npm start

# In another terminal, expose your local server
ngrok http 5000

# Note the HTTPS URL provided (e.g., https://abc123.ngrok.io)
```

## Step 3: Configure Webhook in Meta App Dashboard

1. **Go to Meta App Dashboard**
   - Visit: https://developers.facebook.com/apps
   - Select your app

2. **Navigate to WhatsApp > Configuration**
   - In the left sidebar, click on "WhatsApp" > "Configuration"

3. **Configure Webhook**
   - Click "Edit" next to Webhook
   - Enter your Callback URL: `https://yourdomain.com/api/webhook`
   - Enter your Verify Token: (the same token from your `.env` file)
   - Click "Verify and Save"

4. **Subscribe to Webhook Fields**
   - After verification, you'll see "Webhook Fields"
   - Subscribe to these fields:
     - ✅ **messages**: Receive incoming messages
     - ✅ **message_status**: Receive delivery/read receipts
     - (Optional) **message_template_status_update**: Template approval updates
     - (Optional) **account_alerts**: Account-level alerts

5. **Save Configuration**

## Step 4: Test Your Webhook

### Test 1: Verification Test
Meta will automatically send a GET request to verify your webhook. Check your server logs for:
```
✅ Webhook verified successfully
```

### Test 2: Send a Test Message
1. Send a WhatsApp message to your business number
2. Check your server logs for:
```
📩 Incoming webhook: {...}
📨 New message from [Name] ([Phone])
✅ Message saved to database: [ID]
```

3. Verify the message appears in your database:
```bash
# Connect to MongoDB
mongosh imessenger

# Query messages
db.messages.find().sort({timestamp: -1}).limit(1)
```

## Webhook Event Types

### Messages Event
Triggered when someone sends a message to your WhatsApp Business number.

**Supported Message Types:**
- `text`: Plain text messages
- `image`: Images (with optional caption)
- `video`: Videos (with optional caption)
- `audio`: Voice messages
- `document`: PDF, DOC, etc.
- `location`: Location shares
- `contacts`: Contact cards
- `sticker`: Stickers
- `button`: Button replies
- `interactive`: Interactive message replies (buttons, lists)

### Message Status Event
Triggered when message status changes.

**Status Types:**
- `sent`: Message sent to WhatsApp servers
- `delivered`: Message delivered to recipient
- `read`: Message read by recipient
- `failed`: Message delivery failed

## Webhook Payload Examples

### Incoming Text Message
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": {
          "display_phone_number": "PHONE_NUMBER",
          "phone_number_id": "PHONE_NUMBER_ID"
        },
        "contacts": [{
          "profile": {
            "name": "John Doe"
          },
          "wa_id": "1234567890"
        }],
        "messages": [{
          "from": "1234567890",
          "id": "wamid.XXX",
          "timestamp": "1234567890",
          "text": {
            "body": "Hello!"
          },
          "type": "text"
        }]
      },
      "field": "messages"
    }]
  }]
}
```

### Message Status Update
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": {
          "display_phone_number": "PHONE_NUMBER",
          "phone_number_id": "PHONE_NUMBER_ID"
        },
        "statuses": [{
          "id": "wamid.XXX",
          "status": "delivered",
          "timestamp": "1234567890",
          "recipient_id": "1234567890"
        }]
      },
      "field": "messages"
    }]
  }]
}
```

## Troubleshooting

### Webhook Verification Failed
- **Check**: Verify token in `.env` matches the token in Meta dashboard
- **Check**: Server is running and accessible via HTTPS
- **Check**: Callback URL is correct
- **Logs**: Check server logs for error messages

### Not Receiving Webhook Events
- **Check**: Webhook fields are subscribed in Meta dashboard
- **Check**: App is in Live mode or you're using a test number
- **Check**: Server is running and accessible
- **Check**: No firewall blocking Meta's webhook servers

### Messages Not Saving to Database
- **Check**: MongoDB is running and connected
- **Check**: Message model schema is correct
- **Logs**: Check for database errors in server logs

## Security Best Practices

1. **Verify Request Source**: All webhook requests should come from Meta's servers
2. **Use Strong Verify Token**: Generate a cryptographically secure random token
3. **HTTPS Only**: Never use HTTP for webhooks
4. **Validate Payload**: Parse and validate incoming webhook data
5. **Handle Errors Gracefully**: Always return 200 OK to prevent Meta retries

## Rate Limits

- Meta may retry failed webhooks up to 3 times
- Webhooks timeout after 15 seconds
- Process webhooks quickly and return 200 OK immediately
- Use background jobs for heavy processing

## Additional Resources

- [Meta Webhooks Documentation](https://developers.facebook.com/docs/graph-api/webhooks)
- [WhatsApp Business Platform API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Webhook Security Guide](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#security)

## Auto-Reply Feature (Optional)

To enable auto-replies for incoming messages, uncomment this line in `webhookController.js`:

```javascript
// Auto-reply logic (optional - you can customize this)
await sendAutoReply(message.from, senderName);
```

Then customize the `sendAutoReply()` function to send your desired response.
