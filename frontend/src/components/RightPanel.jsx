import React from 'react';

export default function RightPanel() {
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
          <h3 className="widget-title" style={{ margin: 0 }}>Suggested Minds</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: '600' }}>View All</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { name: 'Selah Kim', handle: '@selah_ui' },
            { name: 'Tarik O\'Connor', handle: '@tarikfoundry' },
            { name: 'Dr. Ananya Sen', handle: '@ananya_ml' }
          ].map((mind, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="avatar" style={{ width: '36px', height: '36px' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{mind.name}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{mind.handle}</span>
                </div>
              </div>
              <button className="primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}>Follow</button>
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
