"use client"
import React, { useEffect, useState } from 'react'
import { chat_service, useAppData, User } from '../context/AppContext';
import { useRouter } from 'next/navigation';
import Loading from '../component/loading';
import ChatSidebar from '../component/ChatSidebar';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from 'axios';
import ChatHeader from '../component/ChatHeader';


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
    const [showAllUsers, setShowAllUsers] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeOut, setTypingTimeOut] = useState<NodeJS.Timeout | null>(null)

    const router = useRouter();
    useEffect(() => {
        if (!loading && !isAuth) {
            router.push("/login");
        }
    }, [loading, isAuth, router]);

    const handleLogout = () => logoutUser();

    async function fetchChat(){
        const token = Cookies.get('token');
        try{
            const { data }= await axios.get(`${chat_service}/api/v1/message/${selectedUser}`, {
                headers: {
                    Authorization:`Bearer ${token}`
                }
            });

            console.log(data,"data line 71")
            setMessages(data.messages);
            setUser(data.user.user);
            await fetchChats();
        }catch(error){
            console.log(error);
            toast.error("Failed to load message");
        }
    }

    async function createChat(u:User){
        try{
            const token = Cookies.get("token");
            const { data } = await axios.post(`${chat_service}/api/v1/chat/new`, {
                userId: loggedInUser?._id,
                otherUserId: u._id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setSelectedUser(data.chatId);
            setShowAllUsers(false);
            await fetchChats();
        }catch(error){
            toast.error("Failed to start chat.")
        }
    }

    useEffect(()=>{
        if(selectedUser){
            fetchChat();
        }
    },[selectedUser])

    if (loading) return <Loading />
    return (
        <div className='min-h-screen flex bg-gray-900 text-white relative overflow-hidden'>
            <ChatSidebar sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen}
            showAllUsers={showAllUsers} 
            setShowAllUsers={setShowAllUsers} 
            users={users} 
            loggedInUser={loggedInUser} 
            chats={chats} 
            selectedUser={selectedUser} 
            setSelectedUser={setSelectedUser} 
            handleLogout={handleLogout} 
            createChat = {createChat}
            />


            {/*New module starts*/}
            <div className='flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border-1 border-white/10'>
                 <ChatHeader user={user} setSidebarOpen={setSidebarOpen} isTyping={isTyping} />
            </div>
        </div>
    )

}

export default ChatApp;