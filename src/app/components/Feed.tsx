// components/Feed.tsx
import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';

interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsQuery = query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
        const postsSnapshot = await getDocs(postsQuery);
        const postsData = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        } as Post));
        setPosts(postsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load posts');
        console.error('Error loading posts:', err);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="feed">
      {posts.map(post => (
        <div key={post.id} className="post">
          <p>{post.content}</p>
          <small>{new Date(post.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default Feed;
