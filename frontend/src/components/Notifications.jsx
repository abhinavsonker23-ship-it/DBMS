import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Bell } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button className="icon-btn" onClick={() => setIsOpen(!isOpen)}>
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="badge">{notifications.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-panel glass">
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Notifications</h3>
          {notifications.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No new notifications</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.notification_id} className="notification-item">
                Someone {notif.type}d your post! 
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {new Date(notif.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
