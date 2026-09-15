import React from 'react';
import { Home, Bell, MessageSquare, Bookmark, User, Edit3 } from 'lucide-react';

export default function Sidebar({ activeTab, onLogout, onTabChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-dot"></div>
        Kinetic
      </div>

      <button className="primary" style={{ marginBottom: '2rem', width: '100%' }}>
        <Edit3 size={18} /> New Post
      </button>

      <nav className="nav-menu">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => onTabChange('home')}
        >
          <Home size={20} /> Home
        </button>
        <button className="nav-item">
          Communities
        </button>
        <button className="nav-item">
          <Bell size={20} /> Notifications
        </button>
        <button className="nav-item">
          <MessageSquare size={20} /> Messages
        </button>
        <button className="nav-item">
          <Bookmark size={20} /> Bookmarks
        </button>
        <button className="nav-item">
          <User size={20} /> Profile
        </button>
      </nav>

      <div className="user-profile-badge" onClick={onLogout}>
        <img src="https://ui-avatars.com/api/?name=User&background=random" className="avatar" alt="Avatar" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Current User</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Log Out</span>
        </div>
      </div>
    </aside>
  );
}
