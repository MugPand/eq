"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { auth, firestore } from '../../lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { updateEmail, updatePassword } from 'firebase/auth';
import Navbar from '../components/Navbar'; // Adjust the import path as necessary

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (currentUser) {
      const fetchProfileData = async () => {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setProfileData(userDoc.data());
            setUsername(userDoc.data().username);
            setEmail(userDoc.data().email);
          }

          const postsQuery = query(collection(firestore, 'posts'), where('userId', '==', currentUser.uid));
          const postsSnapshot = await getDocs(postsQuery);
          const userPosts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPosts(userPosts);

          setLoading(false);
        } catch (err) {
          setError('Failed to fetch profile data');
          setLoading(false);
        }
      };
      fetchProfileData();
    }
  }, [currentUser]);

  const handleUpdateProfile = async () => {
    setError('');
    try {
      if (email !== profileData.email) {
        await updateEmail(auth.currentUser!, email);
      }
      if (password) {
        await updatePassword(auth.currentUser!, password);
      }
      await updateDoc(doc(firestore, 'users', currentUser!.uid), {
        username,
        email,
      });
      setProfileData((prev: any) => ({
        ...prev,
        username,
        email,
      }));
    } catch (err: any) {
      setError(err.message);
    }
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex flex-grow items-center justify-center p-4 mt-16">
        <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-4">User Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700">New Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={handleUpdateProfile}
              className="w-full py-2 mt-4 bg-indigo-600 text-white font-bold rounded-md"
            >
              Update Profile
            </button>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Account Information:</h3>
            <p>Total Likes: {profileData?.totalLikes}</p>
            <p>Posts: {profileData?.numPosts}</p>
            <p>Comments: {profileData?.numComments}</p>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Your Posts:</h3>
            {posts.length > 0 ? (
              <ul>
                {posts.map((post) => (
                  <li key={post.id} className="mb-4 p-4 border border-gray-300 rounded-md">
                    <h4 className="text-lg font-bold">{post.title}</h4>
                    <p>{post.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
