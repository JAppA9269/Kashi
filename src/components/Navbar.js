import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTheme, setTheme } from '../theme';

export default function Navbar() {
  const navigate = useNavigate();
  const [theme, setThemeState] = useState(getTheme());
  const username = localStorage.getItem('kashi_user');

  const handleLogout = () => {
    localStorage.removeItem('kashi_user');
    navigate('/login');
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setThemeState(newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  const profile = JSON.parse(localStorage.getItem(`profile_${username}`)) || {};
  const avatar =
    profile.photo || `https://api.dicebear.com/6.x/fun-emoji/svg?seed=${encodeURIComponent(username)}`;

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--card)',
        borderTop: '1px solid var(--accent)',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      {/* Left Side Links */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/sell">Sell</Link>
        <Link to="/my-listings">My Listings</Link>
        {username && <Link to={`/profile/${username}`}>Profile</Link>}
      </div>

      {/* Right Side */}
      {!username ? (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleThemeToggle}
            style={{
              padding: '6px',
              background: 'none',
              border: '1px solid var(--accent)',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>

          <div
            onClick={() => navigate(`/profile/${username}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            <img
              src={avatar}
              alt="avatar"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <span style={{ fontWeight: 'bold', color: 'var(--text)' }}>@{username}</span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: '6px 10px',
              backgroundColor: '#eee',
              border: '1px solid #ccc',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
