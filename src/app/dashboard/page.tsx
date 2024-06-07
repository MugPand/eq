// pages/Dashboard.tsx
"use client";
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { auth, firestore } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp

interface UserProfile {
  name: string;
  email: string;
  postCount: number;
  commentCount: number;
  dateCreated: Date,
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const userRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<UserProfile, 'dateCreated'> & { dateCreated: Timestamp };

            // Fetch posts count
            const postsQuery = query(
              collection(firestore, 'posts'),
              where('userId', '==', user.uid)
            );
            const postsSnapshot = await getDocs(postsQuery);
            const postCount = postsSnapshot.size;

            // Fetch comments count
            const commentsQuery = query(
              collection(firestore, 'comments'),
              where('userId', '==', user.uid)
            );
            const commentsSnapshot = await getDocs(commentsQuery);
            const commentCount = commentsSnapshot.size;

            // Convert Firestore Timestamp to JavaScript Date
            const dateCreated = userData.dateCreated.toDate();

            setProfile({ 
              ...userData, 
              postCount, 
              commentCount, 
              dateCreated 
            });
          } else {
            console.error('No such user document!');
            setError('No user profile found');
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError('Failed to fetch user profile');
        }
      }
    };

    if (!loading && user) {
      fetchUserProfile();
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
          {profile ? (
            <>
              <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
              <div className="mb-4">
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Statistics</h3>
                <p><strong>Posts:</strong> {profile.postCount}</p>
                <p><strong>Comments:</strong> {profile.commentCount}</p>
                <p><strong>Date Created:</strong> {profile.dateCreated.toDateString()}</p>
              </div>
            </>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
