// pages/Dashboard.tsx
"use client";

import Navbar from '../components/Navbar';
import Feed from '../components/Feed';
import { useAuth } from '../../context/authContext';

const Dashboard: React.FC = () => {
  const { loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <Feed />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
