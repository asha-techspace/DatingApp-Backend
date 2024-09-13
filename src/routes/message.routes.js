import express from 'express';
import { addMessage, getMessages } from '../controllers/message/message.controller.js';
import { verifyUser } from '../middlewares/verifyjwt.middleware.js';

const router = express.Router();

router.post('/', addMessage);

router.get('/:chatId', getMessages);

export default router