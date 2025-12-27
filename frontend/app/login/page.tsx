"use client"
import axios from 'axios';
import { ArrowRight, Loader2, Mail } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useAppData } from '../context/AppContext';
import Loading from '../component/loading';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [loader, setLoader] = useState<boolean>(false);
    const router = useRouter();

    const { isAuth, loading: userLoading} = useAppData();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
            setLoader(true);
            try{
                const {data} = await axios.post(`http://localhost:3000/api/v1/login`, {
                    email
                });
                console.log(data);
                toast.success(data.message);
                router.push(`/verify?email=${email}`);

            }catch(err){
                // toast.error(err )
                alert(err)
            }finally{
                setLoader(false);
            }
    }
    if(userLoading) return <Loading/>;
    if(isAuth) redirect ('/chat')
    return (
        <div className='min-h-screen bg-gray-900 flex items-center justify-center p-4'>
            <div className="max-w-md w-full">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                            <Mail className='text-white' size={40} />
                        </div>
                        <h1 className='text-4xl font-bold text-white mb-3'>
                            Welcome To ChatApp
                        </h1>
                        <p className='text-gray-300 text-lg'>
                            Enter you email to continue your journey
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div>
                            <label htmlFor="email" className='block text-sm font-medium text-gray-300 mb-2'>
                                Email Address 
                            </label>
                            <input 
                            type='email' 
                            id='email'
                            className='w-full px-4 py-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400' 
                            placeholder='Enter your email address' 
                            required
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            />
                        </div>
                        <button type='submit'
                        className='w-full bg-blue-600 text-white px-6 py-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 
                        disabled:cursor-not-allowed'
                        disabled={loader}>
                            {loader ? <div className="flex items-center justify-center gap-2">
                                <Loader2 className='w-5 h-5'/>
                                Sending OTP to your email...
                            </div> : 
                             <div className="flex items-center justify-center gap-2">
                                <span>Send Verification Code</span>
                                <ArrowRight className='w-5 h-5' />
                            </div>
                            }
                           
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;