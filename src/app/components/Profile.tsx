// pages/dashboard.tsx
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

interface UserProfile {
  name: string;
  email: string;
  postCount: number;
  commentCount: number;
}

const Profile: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          // Fetch additional stats (posts, comments, etc.)
          // Example: Assuming you have subcollections for posts and comments
          const postCount = 10; // Replace with actual logic to count user's posts
          const commentCount = 20; // Replace with actual logic to count user's comments
          setProfile({ ...userData, postCount, commentCount });
        }
      }
    };

    if (!loading) {
      if (user) {
        fetchUserProfile();
      } else {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Navbar />
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

export default Profile;
