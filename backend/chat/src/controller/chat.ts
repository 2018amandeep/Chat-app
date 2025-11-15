import type { Response } from "express";
import tryCatch from "../config/tryCatch.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { Chat } from "../models/chat.js";
import { Message } from "./messages.js";
import axios from "axios";

export const createNewChat = tryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
        return res.status(400).json({
            message: "Other user id is required"
        });
    }

    const existingChat = await Chat.findOne({
        users: {
            $all: [userId, otherUserId],
            $size: 2
        }
    });

    if (existingChat) {
        return res.status(200).json({
            message: "Chat already exists",
            chat: existingChat._id
        });
    }

    const newChat = await Chat.create({
        users: [userId, otherUserId]
    });

    res.status(201).json({
        message: "Chat created successfully",
        chat: newChat._id
    });
});

export const getAllChats = tryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(400).json({
            message: "User id is required"
        });
    }
    const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });

    const chatWithUserData = await Promise.all(
        chats.map(async (chat) => {
            const otherUserId = chat.users.find((id) => id.toString() !== userId.toString());
            const unSeenCount = await Message.countDocuments({
                chatId: chat._id,
                seen: false,
                // sender: otherUserId
                sender: { $ne: userId }
            })

            try {
                const { data } = await axios.get(`${process.env.USER_SERVICE_URI}/api/v1/user/${otherUserId}`,
                    {
                        headers: {
                            authorization: req?.headers?.authorization
                        }
                    }
                )

                return {
                    user: data,
                    chat: {
                        ...chat.toObject(),
                        unSeenCount,
                        latestMessage: chat.latestMessage || null
                    }
                }
            } catch (err) {
                console.log(err);
                return {
                    user: { _id: otherUserId, name: " Unknown User" },
                    chat: {
                        ...chat.toObject(),
                        unSeenCount,
                        latestMessage: chat.latestMessage || null
                    }
                }
            }
        })
    )
    res.status(200).json({
        message: "Chats fetched successfully",
        chats: chatWithUserData
    });
})

export const sendMessage = tryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const senderId = req.user?._id;

    const { chatId, text } = req.body;
    const image: any = req.file?.path || null;

    if (!senderId) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    if (!chatId) {
        res.status(400).json({
            message: "Chat id is required"
        });
        return;
    }

    if (!text && !image) {
        res.status(400).json({
            message: "Either message or text is required"
        });
        return;
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
        res.status(404).json({
            message: "Chat not found"
        });
        return;
    }

    const isUserInChat = chat.users.some((userId) => userId.toString() === senderId.toString());
    if (!isUserInChat) {
        res.status(401).json({
            message: "You are not participant of this chat."
        });
        return;
    }

    const otherUserId = chat.users.find((userId) => userId.toString() !== senderId.toString());
    if (!otherUserId) {
        res.status(401).json({
            message: "No other user."
        });
    }

    // Socket setup

    let message: any = {

        chatId: chatId,
        sender: senderId,
        seen: false,
        seenAt: undefined
    }

    if (image) {
        message.image = {
            url: image?.path,
            publicId: image?.filename
        },
            message.messageType = "image",
            message.text = text || ''
    } else {
        message.messageType = 'text',
            message.text = text
    }

    const msg = new Message(message);
    const savedMessage = await msg.save();

    const latestMessageText = image ? "Image" : text;

    await Chat.findByIdAndUpdate(chatId, {
        latestMessage: {
            text: latestMessageText,
            sender: senderId
        },
        updatedAt: new Date()
    }, { new: true })

    // emit to socket

    res.status(201).json({
        message: savedMessage,
        sender: senderId
    });
})

export const getMessageByChat = tryCatch(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const { chatId } = req.params;

    if (!userId) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    if (!chatId) {
        res.status(400).json({
            message: "Chat id is required"
        });
        return;
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
        res.status(404).json({
            message: "Chat not found"
        });
        return;
    }

    const isUserInChat = chat.users.some((id) => id.toString() === userId.toString());
    if (!isUserInChat) {
        res.status(401).json({
            message: "You are not participant of this chat."
        });
        return;
    }

    const messageToMarkAsSeen = await Message.find({
        chatId: chatId,
        seen: false,
        sender: { $ne: userId }
    });

    await Message.updateMany(
        {
            chatId: chatId,
            seen: false,
            sender: { $ne: userId }
        },
        {
            $set: {
                seen: true,
                seenAt: new Date()
            }
        }
    )
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

    const otherUserId = chat.users.find((id) => id.toString() !== userId.toString());

    if (!otherUserId) {
        return res.status(404).json({
            message: "No other user."
        });
    }

    try {
        const { data } = await axios.get(`${process.env.USER_SERVICE_URI}/api/v1/user/${otherUserId}`,
            {
                headers: {
                    authorization: req?.headers?.authorization
                }
            }
        )

        // socket work

        res.json({
            user: data,
            messages
        });
    } catch (err) {
        res.json({
            messages,
            user: {
                _id: otherUserId,
                name: "Unknown User"
            }
        })
    }
})