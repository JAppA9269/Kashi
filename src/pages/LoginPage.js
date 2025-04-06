import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../data/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      return setError('Please enter both email and password.');
    }

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        localStorage.setItem('kashi_user', email); // ✅ Store email as session
        setSuccess(true);
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (err) {
      setError('Login failed.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '400px', margin: '0 auto', color: 'var(--text)' }}>
      <h2>Welcome to Kashi 👋</h2>
      <p>Log in with your email and password:</p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="e.g. you@email.com"
        style={inputStyle}
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Your password"
        style={inputStyle}
      />

      <button onClick={handleLogin} style={buttonStyle}>Log In</button>

      <button
        onClick={() => navigate('/signup')}
        style={{ ...buttonStyle, backgroundColor: '#aaa', marginTop: '10px' }}
      >
        Create an Account
      </button>

      {success && <p style={{ color: 'green', marginTop: '10px' }}>✅ Logged in! Redirecting...</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>❌ {error}</p>}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  backgroundColor: 'var(--bg)',
  color: 'var(--text)',
  border: '1px solid var(--accent)',
  borderRadius: '6px',
};

const buttonStyle = {
  width: '100%',
  backgroundColor: 'var(--accent)',
  color: '#fff',
  padding: '10px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};
