// pages/Feed.tsx

"use client";

import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import Navbar from "../components/Navbar";

const Feed: React.FC = () => {
    const [posts, setPosts] = useState<string[]>([]);

    useEffect(() => {
        // simulates fetching posts from an API
        const fetchedPosts = [
            "Post 1 content...",
            "Post 2 content...",
            "Post 3 content...",
        ];
        setPosts(fetchedPosts);
    }, []);

    return (
        <>
        <Navbar/>
        <div className="p-4">
            {posts.map((post, index) => (
                <Post key={index} content={post} />
            ))}
        </div>
        </>
    );
}


export default Feed;