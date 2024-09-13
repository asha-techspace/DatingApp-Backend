import express from 'express'
import { createChat, findChat, userChats } from '../controllers/Chat/chat.controller.js';
import { verifyUser } from '../middlewares/verifyjwt.middleware.js';
const router = express.Router()

router.post('/', createChat);
router.get('/:userId', userChats);
router.get('/find/:firstId/:secondId', findChat);

export default router