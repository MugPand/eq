import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../context/authContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
    const { currentUser } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };


  return (
    <nav className="fixed w-full bg-white text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-transparent bg-clip-text"
                 style={{ backgroundImage: 'linear-gradient(45deg, white, purple, red)' }}>
              <Link href='/'>EQ</Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/profile" className="block mt-4 md:mt-0 text-gray-800">Profile</Link>
                <Link href="/feed" className="block mt-4 md:mt-0 text-gray-800">Feed</Link>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
          {/* <button onClick={() => setIsOpen(!isOpen)} type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" aria-controls="mobile-menu" aria-expanded="false"> */}
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="px-4=2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Home</Link> */}
          <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium bg-gray-100 text-gray-800">Home</Link>
          <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium mt-4 md:mt-0 bg-gray-100 text-gray-800">Profile</Link>
          <Link href="/feed" className="block px-3 py-2 rounded-md text-base font-medium mt-4 md:mt-0 bg-gray-100 text-gray-800">Feed</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
