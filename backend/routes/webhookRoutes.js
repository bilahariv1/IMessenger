import express from 'express';
import * as webhookController from '../controllers/webhookController.js';

const router = express.Router();

// GET /webhook - Webhook verification endpoint
router.get('/webhook', webhookController.verifyWebhook);

// POST /webhook - Receive webhook events
router.post('/webhook', webhookController.handleWebhook);

export default router;
