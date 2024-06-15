import { useState, useEffect } from 'react';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    updateDoc,
    doc,
    arrayUnion,
    addDoc,
    Timestamp,
    getDoc, // Import getDoc to fetch document snapshot
    arrayRemove
} from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { useAuth } from '../../context/authContext';
import CommentSection from './CommentSection'; // Import the CommentSection component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';


interface Post {
    id: string;
    userId: string;
    content: string;
    createdAt: any;
    likes: number;
    dislikes: number;
    likedBy: string[];
    dislikedBy: string[];
}

const Feed: React.FC = () => {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState('mostRecent');

    const fetchPosts = (sortOption: string) => {
        let q;
    
        if (sortOption === 'mostLikes') {
          q = query(collection(firestore, 'posts'), orderBy('likes', 'desc'));
        } else {
          q = query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
        }
    
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const postsData: Post[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            postsData.push({ id: doc.id, ...data } as Post);
          });
          setPosts(postsData);
        }, (err) => {
          console.error('Error fetching posts:', err);
        });
    
        return unsubscribe;
      };
    
      useEffect(() => {
        const unsubscribe = fetchPosts(sortOption);
        return () => unsubscribe();
      }, [sortOption]);
    

    const handleLike = async (postId: string) => {
        if (!currentUser) return;

        const postRef = doc(firestore, 'posts', postId);
        const postDoc = await getDoc(postRef); // Use getDoc to fetch document snapshot
        if (!postDoc.exists()) {
            setError('Post not found');
            return;
        }

        const postData = postDoc.data() as Post;
        const alreadyLiked = postData.likedBy?.includes(currentUser.uid);
        const alreadyDisliked = postData.dislikedBy?.includes(currentUser.uid);

        if (alreadyLiked) {
            await updateDoc(postRef, {
                likes: postData.likes - 1,
                likedBy: arrayRemove(currentUser.uid)
            });
        } else {
            const updates: any = {
                likes: postData.likes + 1,
                likedBy: arrayUnion(currentUser.uid)
            };
            if (alreadyDisliked) {
                updates.dislikes = postData.dislikes - 1;
                updates.dislikedBy = arrayRemove(currentUser.uid);
            }
            await updateDoc(postRef, updates);
        }
    };

    const handleDislike = async (postId: string) => {
        if (!currentUser) return;

        const postRef = doc(firestore, 'posts', postId);
        const postDoc = await getDoc(postRef); // Use getDoc to fetch document snapshot
        if (!postDoc.exists()) {
            setError('Post not found');
            return;
        }

        const postData = postDoc.data() as Post;
        const alreadyDisliked = postData.dislikedBy?.includes(currentUser.uid);
        const alreadyLiked = postData.likedBy?.includes(currentUser.uid);

        if (alreadyDisliked) {
            await updateDoc(postRef, {
                dislikes: postData.dislikes - 1,
                dislikedBy: arrayRemove(currentUser.uid)
            });
        } else {
            const updates: any = {
                dislikes: postData.dislikes + 1,
                dislikedBy: arrayUnion(currentUser.uid)
            };
            if (alreadyLiked) {
                updates.likes = postData.likes - 1;
                updates.likedBy = arrayRemove(currentUser.uid);
            }
            await updateDoc(postRef, updates);
        }
    };

    const handleNewPost = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!currentUser) {
            setError('You must be logged in to create a post');
            return;
        }

        try {
            const post = {
                userId: currentUser.uid,
                content: newPostContent,
                createdAt: Timestamp.fromDate(new Date()),
                likes: 0,
                dislikes: 0,
                likedBy: [],
                dislikedBy: []
            };

            await addDoc(collection(firestore, 'posts'), post);
            setNewPostContent('');
        } catch (err) {
            setError('Failed to create post');
            console.error('Error creating post:', err);
        }
    };

    const calculateNetLikes = (likes: number, dislikes: number) => {
        return likes - dislikes;
    };

    return (
        <div className="feed">
            <div className="sort-options mb-4">
                <label htmlFor="sort" className="mr-2">Sort by:</label>
                <select
                    id="sort"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md"
                >
                    <option value="mostRecent">Most Recent</option>
                    <option value="mostLikes">Most Likes</option>
                </select>
            </div>
            <div className="create-post mb-6">
                <form onSubmit={handleNewPost} className="bg-white p-4 rounded-lg shadow-md">
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Write your post..."
                        required
                    />
                    <div className="flex justify-between items-center mt-2">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Post</button>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                </form>
            </div>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                        <p className="text-gray-800">{post.content}</p>
                        <div className="flex justify-between items-center mt-2">
                            <div>
                                <button onClick={() => handleLike(post.id)} className={`mr-2 ${post.likedBy.includes(currentUser?.uid || '') ? 'text-blue-500' : 'text-gray-500'}`}>
                                    <FontAwesomeIcon icon={faThumbsUp} />
                                </button>
                                <span className={`mx-2 ${calculateNetLikes(post.likes, post.dislikes) > 0 ? 'text-blue-500' : calculateNetLikes(post.likes, post.dislikes) < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                    {calculateNetLikes(post.likes, post.dislikes)}
                                </span>
                                <button onClick={() => handleDislike(post.id)} className={`ml-2 ${post.dislikedBy.includes(currentUser?.uid || '') ? 'text-red-500' : 'text-gray-500'}`}>
                                    <FontAwesomeIcon icon={faThumbsDown} />
                                </button>
                            </div>
                        </div>
                        {/* Render CommentSection for each post */}
                        <CommentSection postId={post.id} />
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No posts available.</p>
            )}
        </div>
    );
};

export default Feed;
