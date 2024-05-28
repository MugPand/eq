import React from "react";

interface PostProps {
    content: string;
}
  
const Post: React.FC<PostProps> = ({ content }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <p>{content}</p>
        </div>
    );
};
  
export default Post;