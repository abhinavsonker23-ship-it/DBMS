import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Login from './components/Login';
import Feed from './components/Feed';
import CreatePost from './components/CreatePost';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import { api } from './api';

function App() {
  const [view, setView] = useState('landing');
  const [userId, setUserId] = useState(null);
  const [currentUsername, setCurrentUsername] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProfileUserId, setSelectedProfileUserId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      setUserId(storedId);
      setView('app');
      fetchCurrentUser(storedId);
    }
  }, []);

  const fetchCurrentUser = async (id) => {
    try {
      const data = await api.getUserProfile(id);
      if (data && data.username) {
        setCurrentUsername(data.username);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginSuccess = (id) => {
    setUserId(id);
    setView('app');
    fetchCurrentUser(id);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUserId(null);
    setCurrentUsername('');
    setSelectedProfileUserId(null);
    setActiveTab('home');
    setView('landing');
  };

  const handleRefreshFeed = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleOpenProfile = (targetUserId) => {
    setSelectedProfileUserId(targetUserId);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab) => {
    if (tab === 'profile') {
      setSelectedProfileUserId(userId);
      setActiveTab('profile');
    } else {
      setSelectedProfileUserId(null);
      setActiveTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToFeed = () => {
    setSelectedProfileUserId(null);
    setActiveTab('home');
  };

  if (view === 'landing') {
    return <Landing onGetStarted={() => setView('auth')} />;
  }

  if (view === 'auth') {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-layout animate-slide-up">
      <Sidebar 
        activeTab={activeTab} 
        onLogout={handleLogout} 
        onTabChange={handleTabChange}
        currentUsername={currentUsername}
      />
      
      <main className="feed-column">
        {activeTab === 'profile' ? (
          <Profile 
            userId={selectedProfileUserId || userId} 
            currentUserId={userId} 
            onBack={handleBackToFeed}
            onOpenProfile={handleOpenProfile}
          />
        ) : (
          <>
            {/* Mock Stories Section */}
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}></div> LIVE & STORIES
              </div>
              <div style={{ marginLeft: 'auto', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Explore all &rarr;</div>
            </div>

            <CreatePost onPostCreated={handleRefreshFeed} />
            
            <div className="feed-tabs">
              <div className="feed-tab active">For You</div>
              <div className="feed-tab">Following</div>
              <div className="feed-tab">Deep Dives</div>
              <div className="feed-tab">Tech & Design</div>
              <div className="feed-tab">Essays</div>
            </div>

            <Feed key={refreshKey} userId={userId} onOpenProfile={handleOpenProfile} />
          </>
        )}
      </main>

      <RightPanel onOpenProfile={handleOpenProfile} />
      
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 50 }}>
        <Notifications />
      </div>
    </div>
  );
}

export default App;
