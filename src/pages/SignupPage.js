import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../data/auth';
import { supabase } from '../data/supabaseClient';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError('');
    setSuccess(false);

    if (!email || !password) {
      return setError('Email and password are required.');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    // ✅ Step 1: Sign up the user via Supabase Auth
    const { data, error: signUpError } = await signUp(email, password);
    if (signUpError || !data?.user?.id) {
      console.error(signUpError);
      return setError(signUpError?.message || 'Signup failed. Try again.');
    }

    // ✅ Step 2: Insert into 'users' table
    const user = data.user;
    const userId = user.id;
    const username = email.split('@')[0];
    const avatar = `https://api.dicebear.com/6.x/fun-emoji/svg?seed=${encodeURIComponent(username)}`;

    const { error: insertError } = await supabase.from('users').insert({
      id: userId, // Supabase Auth UID
      email,
      username,
      photo: avatar,
    });

    if (insertError) {
      console.error('Insert error:', insertError);
      return setError('Account created, but failed to save user data.');
    }

    // ✅ Step 3: Success
    setSuccess(true);
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '400px', margin: '0 auto', color: 'var(--text)' }}>
      <h2>Create a Kashi Account</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password (min 6 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />
      <button onClick={handleSignup} style={buttonStyle}>Sign Up</button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>❌ {error}</p>}
      {success && <p style={{ color: 'green', marginTop: '10px' }}>✅ Account created! Redirecting...</p>}

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
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
