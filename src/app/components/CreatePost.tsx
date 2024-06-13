// components/CreatePost.tsx
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { useAuth } from '../../context/authContext';

const CreatePost: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (loading) return; // Prevent form submission if still loading
    if (!currentUser) {
      setError('You must be logged in to create a post');
      return;
    }

    try {
      const post = {
        userId: currentUser.uid,
        content,
        createdAt: new Date(),
      };

      await addDoc(collection(firestore, 'posts'), post);
      setContent('');
    } catch (err) {
      setError('Failed to create post');
      console.error('Error creating post:', err);
    }
  };

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post..."
          required
        />
        <button type="submit">Post</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CreatePost;
