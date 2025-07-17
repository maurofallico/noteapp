'use client'

import { useState } from 'react'
import Link from 'next/link';

export default function LoginPage(){

    const [forgotPassword, setForgotPassword] = useState(false);


    return (
        <div className="h-screen flex justify-center items-center text-black">
            {!forgotPassword ? (
                <div className="bg-slate-50 w-[375px] px-4 h-[300px] rounded-md flex flex-col justify-center gap-4">
            <div className="flex flex-row justify-center items-center gap-2">
                <div className="flex flex-col gap-2 justify-center items-end">
                    <span>
                        E-mail:
                    </span>
                    <span>
                        Password:
                    </span>
                </div>
                <div className="flex flex-col gap-2 justify-center w-[200px]">
                    <input className="bg-white border border-black px-1 rounded focus:outline-none"/>
                    <input className="bg-white border border-black px-1 rounded focus:outline-none"/>
                </div>
            </div>
            <div className="flex flex-col px-8 gap-1">
                <button className="border border-black w-full py-1 rounded">
                    LOGIN
                </button>
                <span className="text-xs text-start">
                    Forgot your password? Click <button onClick={() => setForgotPassword(true)}>HERE</button> 
                </span>
            </div>
                <div className="flex flex-col px-8 h-20 justify-around gap-4">
                    <hr className="border-t border-gray-500 mx-4" />
                    <button className="border border-black w-full py-1 rounded">
                        Continue with Google
                    </button>
                    <span className="text-xs text-start">
                        Don't have an account? <Link href="/register" >SIGN UP</Link> 
                    </span>
                </div>
            </div>
            ) : (
                <div className="bg-slate-50 w-[325px] h-[300px] rounded-md flex flex-col justify-center gap-4">
            <div className="flex flex-row justify-center items-center gap-2">
                <div className="flex flex-col gap-2 justify-center items-end">
                    <span>
                        E-mail:
                    </span>
                </div>
                <div className="flex flex-col gap-2 justify-center w-[200px]">
                    <input className="bg-white border border-black"/>
                </div>
            </div>
            <div className="flex flex-col px-4 gap-1">
                <button className="border border-black w-full py-1 rounded">
                    Recover Password
                </button>
            </div>
                <div className="flex flex-col px-4 h-20 justify-around">
                    <hr className="border-t border-gray-500 mx-4" />
                    <button onClick={() => setForgotPassword(false)} className="border border-black w-full py-1 rounded">
                        Back to Login
                    </button>
                </div>
            </div>
            )}
            
            </div>
    )
}