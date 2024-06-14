// pages/Dashboard.tsx
"use client";

import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import Feed from '../components/Feed';
import { useAuth } from '../../context/authContext';

const Dashboard: React.FC = () => {
  const { loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 bg-white p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
          <nav>
            <ul>
              <li className="mb-2">
                <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-700 hover:text-gray-900">Profile</a>
              </li>
              <li>
                <a href="#" className="text-gray-700 hover:text-gray-900">Settings</a>
              </li>
            </ul>
          </nav>
        </aside>
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
