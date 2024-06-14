// components/CreatePost.tsx
import { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { useAuth } from '../../context/authContext';

interface CreatePostProps {
  onSubmit: (content: string) => Promise<void>;
}

const CreatePost: React.FC<CreatePostProps> = ({ onSubmit }) => {
  const { currentUser, loading } = useAuth();
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (loading) return;
    if (!currentUser) {
      setError('You must be logged in to create a post');
      return;
    }

    try {
      await onSubmit(content); // Call the onSubmit function passed from props
      setContent('');
    } catch (err) {
      setError('Failed to create post');
      console.error('Error creating post:', err);
    }
  };

  return (
    <div className="create-post mb-6">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post..."
          required
        />
        <div className="flex justify-between items-center mt-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Post</button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
