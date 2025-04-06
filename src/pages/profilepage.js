import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../data/productManager';
import { supabase } from '../data/supabaseClient';
import { uploadAvatar } from '../data/uploadAvatar';
import ProductCard from '../components/ProductCard';

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem('kashi_user');
  const isOwnProfile = username === loggedInUser;

  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState('');
  const [file, setFile] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState('listings');
  const [editMode, setEditMode] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(localStorage.getItem('kashi_show_thumbnails') !== 'true');
  const [userProducts, setUserProducts] = useState([]);

  useEffect(() => {
    fetchProfile();
    const storedFollowers = JSON.parse(localStorage.getItem(`followers_${username}`)) || [];
    const storedFollowing = JSON.parse(localStorage.getItem(`following_${username}`)) || [];
    setFollowers(storedFollowers);
    setFollowing(storedFollowing);

    if (isOwnProfile) {
      localStorage.setItem(`follow_notif_${username}`, '0');
    }

    getAllProducts().then((products) => {
      const filtered = products.filter((p) => p.username === username);
      setUserProducts(filtered);
    });
  }, [username]);

  const sanitizeUrl = (url) => {
    return url?.split('?')[0] || '';
  };

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('bio, photo')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      setPhoto(generateAvatar(username));
      return;
    }

    if (data) {
      setBio(data.bio || '');
      const cleaned = sanitizeUrl(data.photo);
      setPhoto(cleaned || generateAvatar(username));
    }
  };

  const saveProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return alert('Not logged in');

      let avatarUrl = sanitizeUrl(photo);

      if (file) {
        avatarUrl = sanitizeUrl(await uploadAvatar(file, user.id));
      }

      const { error } = await supabase
        .from('users')
        .update({ bio, photo: avatarUrl })
        .eq('id', user.id);

      if (error) {
        console.error(error);
        alert('❌ Failed to save profile changes.');
      } else {
        setFile(null);
        setEditMode(false);
        setPhoto(`${avatarUrl}?t=${Date.now()}`); // Show updated image
      }
    } catch (err) {
      console.error(err);
      alert('❌ Failed to upload avatar or save profile.');
    }
  };

  const handlePhotoChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const previewUrl = URL.createObjectURL(selected);
      setPhoto(previewUrl); // Instant preview
    }
  };

  const handleFollow = () => {
    const updatedFollowers = [...new Set([...followers, loggedInUser])];
    const updatedFollowing = [...new Set([...(JSON.parse(localStorage.getItem(`following_${loggedInUser}`)) || []), username])];
    localStorage.setItem(`followers_${username}`, JSON.stringify(updatedFollowers));
    localStorage.setItem(`following_${loggedInUser}`, JSON.stringify(updatedFollowing));
    const notif = parseInt(localStorage.getItem(`follow_notif_${username}`) || '0');
    localStorage.setItem(`follow_notif_${username}`, (notif + 1).toString());
    setFollowers(updatedFollowers);
  };

  const handleUnfollow = () => {
    const updatedFollowers = followers.filter((u) => u !== loggedInUser);
    const updatedFollowing = (JSON.parse(localStorage.getItem(`following_${loggedInUser}`)) || []).filter((u) => u !== username);
    localStorage.setItem(`followers_${username}`, JSON.stringify(updatedFollowers));
    localStorage.setItem(`following_${loggedInUser}`, JSON.stringify(updatedFollowing));
    setFollowers(updatedFollowers);
  };

  const handleToggleThumbnails = () => {
    const newVal = !showThumbnails;
    setShowThumbnails(newVal);
    localStorage.setItem('kashi_show_thumbnails', newVal.toString());
  };

  const isFollowing = followers.includes(loggedInUser);
  const notifCount = parseInt(localStorage.getItem(`follow_notif_${loggedInUser}`) || '0');

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
        <img src={photo} alt="Profile" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }} />
        {isOwnProfile && !editMode && (
          <button onClick={() => setEditMode(true)} style={editButtonStyle}>✏️ Edit Profile</button>
        )}
      </div>

      {isOwnProfile && editMode ? (
        <div style={{ marginBottom: '20px' }}>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Your bio..." rows={3} style={{ width: '100%', marginBottom: '10px' }} />
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
          <button onClick={saveProfile} style={saveButtonStyle}>💾 Save</button>
        </div>
      ) : (
        <p style={{ marginBottom: '10px' }}>{bio || 'No bio available.'}</p>
      )}

      {!isOwnProfile && loggedInUser && (
        isFollowing
          ? <button onClick={handleUnfollow} style={buttonStyle}>Unfollow</button>
          : <button onClick={handleFollow} style={buttonStyle}>Follow</button>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', marginTop: '10px' }}>
        <TabButton label="Listings" active={activeTab === 'listings'} onClick={() => setActiveTab('listings')} />
        <TabButton label={`Followers (${followers.length})`} active={activeTab === 'followers'} onClick={() => setActiveTab('followers')} />
        <TabButton label={`Following (${following.length})`} active={activeTab === 'following'} onClick={() => setActiveTab('following')} />
        {isOwnProfile && <TabButton label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />}
      </div>

      {activeTab === 'listings' && (
        userProducts.length === 0
          ? <p>No products yet.</p>
          : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {userProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )
      )}

      {activeTab === 'followers' && <UserList users={followers} navigate={navigate} />}
      {activeTab === 'following' && <UserList users={following} navigate={navigate} />}
      {activeTab === 'settings' && (
        <div style={{ paddingTop: '10px' }}>
          <label>
            <input type="checkbox" checked={showThumbnails} onChange={handleToggleThumbnails} style={{ marginRight: '8px' }} />
            Show thumbnail strip on product cards
          </label>
        </div>
      )}

      {isOwnProfile && notifCount > 0 && (
        <div style={{ marginTop: '20px', color: '#E38648', fontWeight: 'bold' }}>
          🔔 You have {notifCount} new follower{notifCount > 1 ? 's' : ''}!
        </div>
      )}
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: '20px',
        border: active ? '2px solid #E38648' : '1px solid #ccc',
        background: active ? '#FFF3EA' : '#f9f9f9',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}

function UserList({ users, navigate }) {
  if (!users.length) return <p>No users to show.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {users.map((username) => {
        const profile = JSON.parse(localStorage.getItem(`profile_${username}`)) || {};
        const photo = profile.photo || generateAvatar(username);
        const bio = profile.bio || 'No bio.';
        return (
          <div
            key={username}
            onClick={() => navigate(`/profile/${username}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              padding: '8px',
              border: '1px solid #eee',
              borderRadius: '8px',
            }}
          >
            <img src={photo} alt={username} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontWeight: 'bold' }}>@{username}</div>
              <div style={{ fontSize: '14px', color: '#777' }}>{bio}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function generateAvatar(username) {
  return `https://api.dicebear.com/6.x/fun-emoji/svg?seed=${encodeURIComponent(username)}`;
}

const buttonStyle = {
  backgroundColor: '#E38648',
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  marginBottom: '10px',
};

const editButtonStyle = {
  padding: '8px 12px',
  backgroundColor: '#eee',
  border: '1px solid #ccc',
  borderRadius: '6px',
  cursor: 'pointer',
};

const saveButtonStyle = {
  backgroundColor: '#E38648',
  color: '#fff',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '6px',
  cursor: 'pointer',
  marginTop: '10px',
};
