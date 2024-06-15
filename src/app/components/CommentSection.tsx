// components/CommentSection.tsx
import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { useAuth } from '../../context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

interface Comment {
    id: string;
    userId: string;
    content: string;
    createdAt: any;
    likes: number;
    dislikes: number;
    likedBy: string[];
    dislikedBy: string[];
}

const CommentSection: React.FC<{ postId: string }> = ({ postId }) => {
    const { currentUser } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const q = query(
            collection(firestore, 'posts', postId, 'comments'),
            orderBy('likes', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const commentsData: Comment[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                commentsData.push({ id: doc.id, ...data } as Comment);
            });
            setComments(commentsData);
        }, (err) => {
            console.error('Error fetching comments:', err);
        });

        return () => unsubscribe();
    }, [postId]);

    const handleNewComment = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!currentUser) {
            setError('You must be logged in to comment');
            return;
        }

        try {
            const comment = {
                userId: currentUser.uid,
                content: newComment,
                createdAt: new Date(),
                likes: 0,
                dislikes: 0,
                likedBy: [],
                dislikedBy: []
            };

            await addDoc(collection(firestore, 'posts', postId, 'comments'), comment);
            setNewComment('');
        } catch (err) {
            setError('Failed to post comment');
            console.error('Error posting comment:', err);
        }
    };

    const handleLikeComment = async (commentId: string) => {
        if (!currentUser) return;

        const commentRef = doc(firestore, 'posts', postId, 'comments', commentId);
        const commentDoc = await getDoc(commentRef);
        const commentData = commentDoc.data() as Comment;
        const alreadyLiked = commentData.likedBy?.includes(currentUser.uid);
        const alreadyDisliked = commentData.dislikedBy?.includes(currentUser.uid);

        if (alreadyLiked) {
            await updateDoc(commentRef, {
                likes: commentData.likes - 1,
                likedBy: arrayRemove(currentUser.uid)
            });
        } else {
            const updates: any = {
                likes: commentData.likes + 1,
                likedBy: arrayUnion(currentUser.uid)
            };
            if (alreadyDisliked) {
                updates.dislikes = commentData.dislikes - 1;
                updates.dislikedBy = arrayRemove(currentUser.uid);
            }
            await updateDoc(commentRef, updates);
        }
    };

    const handleDislikeComment = async (commentId: string) => {
        if (!currentUser) return;

        const commentRef = doc(firestore, 'posts', postId, 'comments', commentId);
        const commentDoc = await getDoc(commentRef);
        const commentData = commentDoc.data() as Comment;
        const alreadyDisliked = commentData.dislikedBy?.includes(currentUser.uid);
        const alreadyLiked = commentData.likedBy?.includes(currentUser.uid);

        if (alreadyDisliked) {
            await updateDoc(commentRef, {
                dislikes: commentData.dislikes - 1,
                dislikedBy: arrayRemove(currentUser.uid)
            });
        } else {
            const updates: any = {
                dislikes: commentData.dislikes + 1,
                dislikedBy: arrayUnion(currentUser.uid)
            };
            if (alreadyLiked) {
                updates.likes = commentData.likes - 1;
                updates.likedBy = arrayRemove(currentUser.uid);
            }
            await updateDoc(commentRef, updates);
        }
    };

    const calculateNetLikes = (likes: number, dislikes: number) => {
        return likes - dislikes;
    };

    return (
        <div className="mt-4">
            <form onSubmit={handleNewComment} className="mb-4">
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    required
                />
                <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Comment</button>
            </form>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="comments">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-100 p-3 rounded-lg mb-2">
                        <p className="text-gray-800">{comment.content}</p>
                        <div className="flex justify-between items-center mt-2">
                            <div>
                                <button onClick={() => handleLikeComment(comment.id)} className={`mr-2 ${comment.likedBy.includes(currentUser?.uid || '') ? 'text-blue-500' : 'text-gray-500'}`}>
                                    <FontAwesomeIcon icon={faThumbsUp} />
                                </button>
                                <span className={`mx-2 ${calculateNetLikes(comment.likes, comment.dislikes) > 0 ? 'text-blue-500' : calculateNetLikes(comment.likes, comment.dislikes) < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                    {calculateNetLikes(comment.likes, comment.dislikes)}
                                </span>
                                <button onClick={() => handleDislikeComment(comment.id)} className={`ml-2 ${comment.dislikedBy.includes(currentUser?.uid || '') ? 'text-red-500' : 'text-gray-500'}`}>
                                    <FontAwesomeIcon icon={faThumbsDown} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
