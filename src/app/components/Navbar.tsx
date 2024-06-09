'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../context/authContext';

const Navbar: React.FC = () => {
    const { currentUser } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };

    return (
        <nav className="bg-white shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold text-transparent bg-clip-text"
                    style={{ backgroundImage: 'linear-gradient(45deg, white, purple, red)' }}>
                    <Link href='/'>EQ</Link>
                </div>
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                        className="text-gray-800 focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            )}
                        </svg>
                    </button>
                </div>
                <div className={`md:flex ${isOpen ? 'block' : 'hidden'} md:items-center space-y-4 md:space-y-0 md:space-x-4`}>
                    <Link href="/dashboard" className="block mt-4 md:mt-0 text-gray-800">Profile</Link>
                    <Link href="/feed" className="block mt-4 md:mt-0 text-gray-800">Feed</Link>
                    <div className="relative mt-4 md:mt-0">
                        <select className="block border border-gray-300 rounded-md p-2 w-full md:w-auto">
                            <option value="">Select Age Range</option>
                            <option value="10-20">10-20</option>
                            <option value="21-30">21-30</option>
                            <option value="31-40">31-40</option>
                            <option value="41+">41+</option>
                        </select>
                    </div>
                    {currentUser ? (
                        <div className="flex flex-col md:flex-row md:items-center mt-4 md:mt-0">
                            <span className="block md:inline-block md:ml-4">{currentUser.email}</span>
                            <button
                                onClick={handleLogout}
                                className="mt-2 md:mt-0 md:ml-4 bg-red-500 text-white px-3 py-2 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => router.push('/')}
                            className="mt-2 md:mt-0 md:ml-4 bg-blue-500 text-white px-3 py-2 rounded"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
