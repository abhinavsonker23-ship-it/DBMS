import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { ArrowUp, MessageSquare, Repeat, Bookmark, Share } from 'lucide-react';

export default function Feed({ userId, onOpenProfile }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const data = await api.getFeed();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    // Optimistic update
    setPosts(posts.map(p => {
      if (p.post_id === postId) {
        return { ...p, like_count: (p.like_count || 0) + 1, has_liked: true };
      }
      return p;
    }));

    try {
      await api.likePost(postId);
    } catch (err) {
      // Revert on failure
      loadFeed();
      alert(err.message);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading feed...</div>;
  if (posts.length === 0) return <div className="card" style={{ textAlign: 'center' }}>No posts in your feed yet!</div>;

  return (
    <div className="post-list">
      {posts.map(post => {
        const authorName = post.username || post.author || 'User';
        return (
        <div key={post.post_id} className="post-card">
          <div className="post-header">
            <img 
              src={`https://ui-avatars.com/api/?name=${authorName}&background=random`} 
              className="avatar avatar-clickable" 
              alt="Avatar" 
              onClick={() => onOpenProfile && onOpenProfile(post.user_id)}
              title={`View ${authorName}'s profile`}
            />
            <div className="post-meta">
              <span 
                className="post-author-name author-clickable"
                onClick={() => onOpenProfile && onOpenProfile(post.user_id)}
                title={`View ${authorName}'s profile`}
              >
                {authorName} <span style={{ color: 'var(--accent-primary)' }}>&#10003;</span>
              </span>
              <span 
                className="post-author-handle author-clickable"
                onClick={() => onOpenProfile && onOpenProfile(post.user_id)}
              >
                @{authorName.toLowerCase().replace(/\s+/g, '_')} • {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
            <div style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }}>
              ...
            </div>
          </div>
          
          <div className="post-content">
            {post.content}
          </div>

          <div className="post-tags">
            <span className="tag">#Design</span>
            <span className="tag">#KineticSocial</span>
          </div>
          
          <div className="post-interaction-bar">
            <button 
              className={`interaction-btn ${post.has_liked ? 'upvoted' : ''}`}
              onClick={() => handleLike(post.post_id)}
            >
              <ArrowUp size={18} />
              <span>{post.like_count || 0}</span>
            </button>
            <button className="interaction-btn">
              <MessageSquare size={18} />
              <span>{Math.floor(Math.random() * 50)}</span>
            </button>
            <button className="interaction-btn">
              <Repeat size={18} />
              <span>{Math.floor(Math.random() * 20)}</span>
            </button>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              <button className="interaction-btn">
                <Bookmark size={18} />
              </button>
              <button className="interaction-btn">
                <Share size={18} />
              </button>
            </div>
          </div>
        </div>
      );
    })}
    </div>
  );
}
