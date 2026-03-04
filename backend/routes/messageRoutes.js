import express from 'express';
import * as messageController from '../controllers/messageController.js';

const router = express.Router();

router.get('/messages', messageController.getAllMessages);
router.post('/reply', messageController.replyMessage);
router.post('/reply/bulk', messageController.replyBulk);

export default router;