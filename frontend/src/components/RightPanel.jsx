import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function RightPanel() {
  const [users, setUsers] = useState([]);
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      const currentUserId = parseInt(localStorage.getItem('userId'), 10);
      // Filter out self and show top 5 other registered users
      const others = data.filter(u => u.user_id !== currentUserId).slice(0, 5);
      setUsers(others);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await api.followUser(userId);
      setFollowingMap(prev => ({ ...prev, [userId]: true }));
    } catch (err) {
      if (err.message && err.message.includes('Already following')) {
        setFollowingMap(prev => ({ ...prev, [userId]: true }));
      } else {
        alert(err.message);
      }
    }
  };

  return (
    <aside className="right-panel">
      
      <div className="widget primary-widget">
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.9 }}>
          Issue #48 • Friday Edition
        </div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', lineHeight: '1.3' }}>
          The Kinetic Dispatch: Curated Essays on Form & Function
        </h3>
        <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '1rem' }}>
          Join 34,000+ designers, founders, and engineers receiving our handpicked long-form critiques every week.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            style={{ 
              flex: 1, 
              padding: '0.6rem', 
              borderRadius: '6px', 
              border: 'none', 
              fontSize: '0.85rem' 
            }} 
          />
          <button style={{ 
            backgroundColor: '#FFFFFF', 
            color: 'var(--accent-primary)', 
            border: 'none', 
            padding: '0 1rem', 
            borderRadius: '6px', 
            fontWeight: '600' 
          }}>
            Subscribe
          </button>
        </div>
      </div>

      <div className="widget">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="widget-title" style={{ margin: 0 }}>Trending Topics</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>Configure</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Architecture • Trending Worldwide</div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.1rem' }}>Brutalist Web Revivals</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>14.8k discourse posts</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hardware UI • Hot</div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.1rem' }}>Tactile Controls in EV Cabins</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>9,420 debates</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AI Ethics</div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.1rem' }}>Autonomous Code Attribution</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>22.4k posts</div>
          </div>
        </div>
      </div>

      <div className="widget">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="widget-title" style={{ margin: 0 }}>Registered Minds ({users.length})</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: '600' }} onClick={loadUsers}>Refresh</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {users.map((mind) => (
            <div key={mind.user_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img 
                  src={`https://ui-avatars.com/api/?name=${mind.username}&background=random`} 
                  className="avatar" 
                  style={{ width: '36px', height: '36px', borderRadius: '50%' }} 
                  alt={mind.username} 
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{mind.username}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {mind.bio || `@${mind.username}`}
                  </span>
                </div>
              </div>
              <button 
                className={followingMap[mind.user_id] ? '' : 'primary'} 
                style={{ 
                  padding: '0.3rem 0.8rem', 
                  fontSize: '0.75rem',
                  backgroundColor: followingMap[mind.user_id] ? 'var(--bg-card)' : undefined,
                  border: followingMap[mind.user_id] ? '1px solid var(--border-color)' : undefined,
                  color: followingMap[mind.user_id] ? 'var(--text-secondary)' : undefined
                }}
                onClick={() => handleFollow(mind.user_id)}
              >
                {followingMap[mind.user_id] ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '0 1rem', lineHeight: '1.5' }}>
        Manifesto • Privacy • Typography Index • Press & Colophon <br/>
        <br/>
        Kinetic Platform © 2026. Built for culture-forward discourse.
      </div>

    </aside>
  );
}
