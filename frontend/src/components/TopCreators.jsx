import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Trophy, Search, TrendingUp, Users, Radio, ExternalLink, ArrowUpDown } from 'lucide-react';

const PLATFORM_COLORS = {
  Instagram: { bg: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', badge: '#e1306c' },
  YouTube: { bg: '#ff0000', badge: '#ff0000' },
  Twitter: { bg: '#1da1f2', badge: '#1da1f2' },
  TikTok: { bg: '#00f2fe', badge: '#25f4ee' },
  Twitch: { bg: '#9146ff', badge: '#9146ff' }
};

export default function TopCreators({ onOpenProfile }) {
  const [creators, setCreators] = useState([]);
  const [stats, setStats] = useState([]);
  const [platform, setPlatform] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rank_asc');
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadCreators();
  }, [platform, search, sortBy]);

  const loadStats = async () => {
    try {
      const data = await api.getTop100Stats();
      setStats(data || []);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const loadCreators = async () => {
    setLoading(true);
    try {
      const data = await api.getTop100({
        platform,
        search,
        sort: sortBy,
        limit: 100
      });
      setCreators(data.creators || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error('Error fetching creators:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    const n = Number(num);
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return n.toLocaleString();
  };

  return (
    <div className="top-creators-container animate-fade-in" style={{ padding: '0.5rem 0' }}>
      {/* Header Banner */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '1.5rem',
        padding: '1.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
            padding: '0.6rem', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Trophy size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>
              Social Media Top 100 Index
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
              Normalized benchmark database of 500 elite creators across Instagram, YouTube, Twitter, TikTok & Twitch
            </p>
          </div>
        </div>

        {/* Global Statistics Cards */}
        {stats.length > 0 && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
            gap: '0.75rem', 
            marginTop: '1.25rem' 
          }}>
            {stats.map((s) => (
              <div 
                key={s.platform}
                onClick={() => setPlatform(platform === s.platform ? 'All' : s.platform)}
                style={{
                  background: platform === s.platform ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: platform === s.platform ? '1px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: PLATFORM_COLORS[s.platform]?.badge || '#cbd5e1' }}>
                  {s.platform}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0.2rem 0' }}>
                  {formatNumber(s.total_followers)}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {formatNumber(s.avg_followers)} avg • {s.creator_count} profiles
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls: Platform Tabs, Search, and Sort */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {/* Platform Selection */}
        <div className="feed-tabs" style={{ margin: 0 }}>
          {['All', 'Instagram', 'YouTube', 'Twitter', 'TikTok', 'Twitch'].map(p => (
            <div 
              key={p}
              className={`feed-tab ${platform === p ? 'active' : ''}`}
              onClick={() => setPlatform(p)}
              style={{ cursor: 'pointer' }}
            >
              {p}
            </div>
          ))}
        </div>

        {/* Search & Sort Row */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'var(--surface-color)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '8px',
            padding: '0.5rem 0.85rem'
          }}>
            <Search size={16} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search creator by handle or name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--text-primary)', 
                outline: 'none', 
                width: '100%',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown size={15} color="var(--text-secondary)" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'var(--surface-color)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <option value="rank_asc">Official Rank (#1 - #100)</option>
              <option value="followers_desc">Most Followers</option>
              <option value="posts_desc">Most Posts Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading dataset from MariaDB...
        </div>
      ) : creators.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
          No creators found matching "{search}".
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '70px 1fr 140px 110px', 
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            letterSpacing: '0.05em'
          }}>
            <div>Rank</div>
            <div>Creator Profile</div>
            <div style={{ textAlign: 'right' }}>Followers</div>
            <div style={{ textAlign: 'right' }}>Posts / Videos</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {creators.map((c, index) => {
              const rank = c.rank_num;
              let rankBadgeColor = 'var(--text-secondary)';
              let rankBg = 'transparent';

              if (rank === 1) {
                rankBadgeColor = '#fbbf24';
                rankBg = 'rgba(251, 191, 36, 0.15)';
              } else if (rank === 2) {
                rankBadgeColor = '#94a3b8';
                rankBg = 'rgba(148, 163, 184, 0.15)';
              } else if (rank === 3) {
                rankBadgeColor = '#d97706';
                rankBg = 'rgba(217, 119, 6, 0.15)';
              }

              const pColor = PLATFORM_COLORS[c.platform]?.badge || '#60a5fa';

              return (
                <div 
                  key={`${c.id}-${index}`}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '70px 1fr 140px 110px', 
                    alignItems: 'center',
                    padding: '0.85rem 1.25rem',
                    borderBottom: index < creators.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* Rank */}
                  <div>
                    <span style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: rankBg,
                      color: rankBadgeColor,
                      fontWeight: '800',
                      fontSize: '0.85rem'
                    }}>
                      #{rank}
                    </span>
                  </div>

                  {/* Profile info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.profile_name)}&background=random`} 
                      style={{ width: '38px', height: '38px', borderRadius: '50%' }}
                      alt={c.profile_name}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {c.profile_name}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: '600', 
                          color: pColor,
                          backgroundColor: `${pColor}20`,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px'
                        }}>
                          {c.platform}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Followers */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {formatNumber(c.followers)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      {Number(c.followers).toLocaleString()}
                    </div>
                  </div>

                  {/* Posts count */}
                  <div style={{ textAlign: 'right', fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {Number(c.posts_count).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
