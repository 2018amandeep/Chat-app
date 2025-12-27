"use client"
import React, { useEffect, useState } from 'react'
import { useAppData, User } from '../context/AppContext';
import { useRouter } from 'next/navigation';
import Loading from '../component/loading';
import ChatSidebar from '../component/ChatSidebar';


export interface Message {
    _id: string;
    chatId: string;
    sender: string;
    text?: string;
    image?: {
        url: string;
        publicId: string;
    }
    messageType: "text" | "image";
    seen: boolean;
    seenAt: string;
    createdAt: string;
}

const ChatApp = () => {
    const { isAuth,
        loading,
        logoutUser,
        chats,
        user: loggedInUser,
        users, fetchChats,
        setChats
    } = useAppData();

    /**
     * Logged in user
     */
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [messages, setMessages] = useState<Message[] | null>(null);
    /**
     * User from whome user is chatting
     */
    const [user, setUser] = useState<User | null>(null);
    const [showAllUsers, serShowAllUsers] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeOut, setTypingTimeOut] = useState<NodeJS.Timeout | null>(null)

    const router = useRouter();
    useEffect(() => {
        if (!loading && !isAuth) {
            router.push("/login");
        }
    }, [loading, isAuth, router]);

    if (loading) return <Loading />
    return (
        <div className='min-h-screen flex bg-gray-900 text-white relative overflow-hidden'>
            <ChatSidebar />
        </div>
    )

}

export default ChatApp;