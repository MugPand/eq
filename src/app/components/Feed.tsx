// components/Feed.tsx
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';

interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: any;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData: Post[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        postsData.push({ id: doc.id, ...data } as Post);
      });
      setPosts(postsData);
      setLoading(false);
    }, (err) => {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="feed">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="post">
            <p>{post.content}</p>
            <span>{new Date(post.createdAt.seconds * 1000).toLocaleString()}</span>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default Feed;
