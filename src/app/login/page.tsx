"use client";

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore, setAuthPersistence } from '../../lib/firebase';
import { useAuth } from '../../context/authContext';

interface LoginCardProps {
  setAuthenticated: (value: boolean) => void;
}

const Login: React.FC<LoginCardProps> = ({ setAuthenticated }) => {
  const router = useRouter();
  const { setAuthenticated: setGlobalAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    try {
      await setAuthPersistence(rememberMe);
      await signInWithEmailAndPassword(auth, email, password);
      setGlobalAuthenticated(true);
      setAuthenticated(true);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional profile data to Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        name,
        email,
        numPosts: 0,
        numComments: 0,
        dateCreated: new Date(),
      });

      await setAuthPersistence(rememberMe);
      setGlobalAuthenticated(true);
      setAuthenticated(true);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center p-4">
      <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-6xl bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center w-full sm:w-1/2 p-8 border-b border-gray-300 sm:border-b-0 sm:border-r border-gray-300">
          <div className="text-[5rem] sm:text-[10rem] font-bold text-transparent bg-clip-text drop-shadow-lg">
            <span className="drop-shadow-md bg-white text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-400 to-red-500">eq</span>
          </div>
          <div className="mt-4 text-lg text-gray-600">
            <p>Where emotions meet humans!</p>
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 flex items-center justify-center">
          <div className="m-8 w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-900">
              {isLogin ? 'Login to Your Account' : 'Create Your Account'}
            </h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form className="mt-8 space-y-6" onSubmit={isLogin ? handleLogin : handleSignup}>
              <div className="rounded-md shadow-sm -space-y-px">
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="sr-only">Full Name</label>
                    <input id="name" name="name" type="text" autoComplete="name" required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)} />
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input id="email" name="email" type="email" autoComplete="email" required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input id="password" name="password" type="password" autoComplete="current-password" required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input id="remember_me" name="remember_me" type="checkbox" checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                    <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Forgot your password?
                    </a>
                  </div>
                </div>
              )}

              <div>
                <button type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  {isLogin ? 'Sign in' : 'Sign up'}
                </button>
              </div>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => setIsLogin(!isLogin)} className="ml-1 font-medium text-indigo-600 hover:text-indigo-500">
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
