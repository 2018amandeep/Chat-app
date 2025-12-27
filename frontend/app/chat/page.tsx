"use client"
import React, { useEffect } from 'react'
import { useAppData } from '../context/AppContext';
import { useRouter } from 'next/navigation';
import Loading from '../component/loading';

const ChatApp = () => {
    const { isAuth, loading } = useAppData();

    const router = useRouter();
    useEffect(() => {
        if (!loading && !isAuth) {
            router.push("/login");
        }
    }, [loading, isAuth, router]);

    if(loading) return <Loading/>
    return (
        <div>
            <h1>ChatApp</h1>
        </div>
    )

}

export default ChatApp;