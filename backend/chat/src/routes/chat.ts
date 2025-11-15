import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { createNewChat, getAllChats, getMessageByChat, sendMessage } from '../controller/chat.js';
import { upload } from '../middleware/multer.js';

const chatRoutes = express.Router();

chatRoutes.post('/chat/new', isAuth, createNewChat);
chatRoutes.get('/chat/all', isAuth, getAllChats);
chatRoutes.post("/message", isAuth, upload.single('image'), sendMessage);
chatRoutes.get('/message/:chatId', isAuth, getMessageByChat);

export default chatRoutes;