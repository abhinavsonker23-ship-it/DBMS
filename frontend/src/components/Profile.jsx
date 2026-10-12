import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { ArrowLeft, Calendar, Users, Edit2, Check, ArrowUp, MessageSquare, Repeat, Bookmark, Share } from 'lucide-react';

export default function Profile({ userId, currentUserId, onBack, onOpenProfile }) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [isSavingBio, setIsSavingBio] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const isSelf = parseInt(currentUserId, 10) === parseInt(userId, 10);

  useEffect(() => {
    loadProfileData();
  }, [userId]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const [profileData, userPosts] = await Promise.all([
        api.getUserProfile(userId),
        api.getUserPosts(userId)
      ]);
      setProfile(profileData);
      setPosts(userPosts);
      setBioInput(profileData.bio || '');
      setIsFollowing(profileData.is_following);
      setFollowersCount(profileData.followers_count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    try {
      if (isFollowing) {
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
        await api.unfollowUser(userId);
      } else {
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        await api.followUser(userId);
      }
    } catch (err) {
      console.error(err);
      // Revert on error
      setIsFollowing(profile.is_following);
      setFollowersCount(profile.followers_count);
      alert(err.message);
    }
  };

  const handleSaveBio = async () => {
    setIsSavingBio(true);
    try {
      await api.updateBio(bioInput);
      setProfile(prev => ({ ...prev, bio: bioInput }));
      setIsEditingBio(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSavingBio(false);
    }
  };

  const handleLikePost = async (postId) => {
    setPosts(posts.map(p => {
      if (p.post_id === postId) {
        return { ...p, like_count: (p.like_count || 0) + 1, has_liked: true };
      }
      return p;
    }));

    try {
      await api.likePost(postId);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <p>User profile not found.</p>
        <button className="primary" onClick={onBack} style={{ marginTop: '1rem' }}>
          Back to Feed
        </button>
      </div>
    );
  }

  const username = profile.username || 'User';

  return (
    <div className="profile-view animate-slide-up">
      {/* Back button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <button 
          onClick={onBack}
          style={{ 
            backgroundColor: 'var(--bg-secondary)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '50%', 
            width: '38px', 
            height: '38px', 
            padding: 0 
          }}
          title="Back to Feed"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.25rem', lineHeight: '1.2' }}>{username}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </span>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="profile-card">
        <div className="profile-banner"></div>
        <div className="profile-body">
          <div className="profile-avatar-row">
            <img 
              src={`https://ui-avatars.com/api/?name=${username}&background=random&size=128`} 
              className="profile-avatar" 
              alt={username} 
            />
            <div>
              {isSelf ? (
                <button 
                  className="secondary" 
                  onClick={() => setIsEditingBio(prev => !prev)}
                >
                  <Edit2 size={16} /> {isEditingBio ? 'Cancel' : 'Edit Bio'}
                </button>
              ) : (
                <button 
                  className={isFollowing ? 'secondary' : 'primary'}
                  onClick={handleToggleFollow}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {username} <span style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>&#10003;</span>
            </h1>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              @{username.toLowerCase().replace(/\s+/g, '_')}
            </div>
          </div>

          {/* Bio Section */}
          {isEditingBio ? (
            <div style={{ marginBottom: '1.25rem' }}>
              <textarea 
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                rows={3}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid var(--accent-primary)', 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                  marginBottom: '0.5rem'
                }}
                placeholder="Write your bio..."
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="primary" 
                  disabled={isSavingBio}
                  onClick={handleSaveBio}
                >
                  <Check size={16} /> {isSavingBio ? 'Saving...' : 'Save Bio'}
                </button>
                <button 
                  className="secondary" 
                  onClick={() => setIsEditingBio(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1rem' }}>
              {profile.bio || <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No bio provided yet.</span>}
            </p>
          )}

          {/* Mutual Followers (Stored Procedure result) */}
          {!isSelf && profile.mutual_followers && profile.mutual_followers.length > 0 && (
            <div className="mutual-pill">
              <Users size={16} />
              <span>
                Mutual connections: {profile.mutual_followers.map(m => m.username).join(', ')}
              </span>
            </div>
          )}

          {/* Joined date & Meta */}
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={15} />
              <span>Joined {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
            </div>
            {profile.email && isSelf && (
              <div style={{ color: 'var(--text-secondary)' }}>
                {profile.email}
              </div>
            )}
          </div>

          {/* Numerical Stats Row */}
          <div className="profile-stats-row">
            <div className="stat-item">
              <span className="stat-number">{profile.posts_count || posts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{followersCount}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{profile.following_count || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* User's Posts Section */}
      <div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          {isSelf ? 'Your Publications' : `${username}'s Publications`}
        </h3>

        {posts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            No posts published by this author yet.
          </div>
        ) : (
          <div className="post-list">
            {posts.map(post => (
              <div key={post.post_id} className="post-card">
                <div className="post-header">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${username}&background=random`} 
                    className="avatar" 
                    alt={username} 
                  />
                  <div className="post-meta">
                    <span className="post-author-name">{username} <span style={{ color: 'var(--accent-primary)' }}>&#10003;</span></span>
                    <span className="post-author-handle">
                      @{username.toLowerCase().replace(/\s+/g, '_')} • {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="post-content">
                  {post.content}
                </div>

                <div className="post-interaction-bar">
                  <button 
                    className={`interaction-btn ${post.has_liked ? 'upvoted' : ''}`}
                    onClick={() => handleLikePost(post.post_id)}
                  >
                    <ArrowUp size={18} />
                    <span>{post.like_count || 0}</span>
                  </button>
                  <button className="interaction-btn">
                    <MessageSquare size={18} />
                    <span>0</span>
                  </button>
                  <button className="interaction-btn">
                    <Repeat size={18} />
                    <span>0</span>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
