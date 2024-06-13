// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, setAuthPersistence } from '../lib/firebase'; // Adjust the import path as necessary

interface AuthContextType {
  currentUser: FirebaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  setAuthenticated: (value: boolean) => void;
  signOutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);

        // Set the persistence when the user logs in
        await setAuthPersistence(rememberMe);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOutUser = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    localStorage.removeItem('rememberMe');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, loading, setAuthenticated: setIsAuthenticated, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
