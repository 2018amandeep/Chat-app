"use client"

import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast'


export const user_service = 'http://localhost:3000';
export const chat_service = 'http://localhost:3002';

export interface User {
    _id: string;
    name: string;
    email: string;
}

export interface Chat {
    _id: string;
    users: string[];
    latestMessage: {
        text: string;
        sender: string;
    }
    createdAt: string;
    updatedAt: string;
    unseenCount?: number;
}

export interface Chats {
    _id: string;
    user: User;
    chat: Chat;
}

export interface AppContextType {
    user: User | null;
    loading: boolean;
    isAuth: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    async function fetchUser() {
        const token = Cookies.get("token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.get(`${user_service}/api/v1/me`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setUser(data);
            setIsAuth(true);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        Cookies.remove('token');
        setIsAuth(false);
        setUser(null);
        toast.success("Logged out successfully");
    }

    const [chats, setChats] = useState<Chats[] | null>(null);

    async function fetchChats() {
        const token = Cookies.get('token')
        try {
            const { data } = await axios.get(`${chat_service}/api/v1/chat/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            )
            setChats(data.chats);
        } catch (err) {
            console.log(err);
        }
    }

    // Fetch all the users to be shown on left menu
    const [users, setUsers] = useState<User[] | null>(null);
    async function fetchUsers() {
        const token = Cookies.get('token');

        try {
            const { data } = await axios.get(`${user_service}/api/v1/user/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUser(data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchUser();
        fetchChats();
        fetchUsers();
    }, [])
    return (
        <AppContext.Provider value={{ user, setUser, isAuth, setIsAuth, loading }}>
            {children}
            <Toaster />
        </AppContext.Provider>
    )
}

export const useAppData = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppData must be used within an AppProvider");
    }

    return context;
}