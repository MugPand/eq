"use client";

import React, { useState } from 'react';
import Login from './login/page';
import Navbar from "./components/Navbar";
import Feed from "./feed/page";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {isAuthenticated ? (
        <>
          <Navbar />
          <Feed />
        </>
      ) : (
        <Login setAuthenticated={setIsAuthenticated} />
      )}
    </div>
  );
}
