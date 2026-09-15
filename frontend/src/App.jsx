import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Login from './components/Login';
import Feed from './components/Feed';
import CreatePost from './components/CreatePost';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import Notifications from './components/Notifications';

function App() {
  const [view, setView] = useState('landing');
  const [userId, setUserId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      setUserId(storedId);
      setView('app');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUserId(null);
    setView('landing');
  };

  const handleRefreshFeed = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (view === 'landing') {
    return <Landing onGetStarted={() => setView('auth')} />;
  }

  if (view === 'auth') {
    return <Login onLoginSuccess={(id) => { setUserId(id); setView('app'); }} />;
  }

  return (
    <div className="app-layout animate-slide-up">
      <Sidebar activeTab="home" onLogout={handleLogout} onTabChange={() => {}} />
      
      <main className="feed-column">
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

        <Feed key={refreshKey} userId={userId} />
      </main>

      <RightPanel />
      
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 50 }}>
        <Notifications />
      </div>
    </div>
  );
}

export default App;
