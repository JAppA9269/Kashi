import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../data/productManager';

export default function AdminDashboard() {
  const username = localStorage.getItem('kashi_user');
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (username !== 'admin') {
      navigate('/');
      return;
    }

    // Load products
    setProducts(getAllProducts());

    // Load users
    const localKeys = Object.keys(localStorage);
    const foundUsers = localKeys
      .filter((key) => key.startsWith('profile_'))
      .map((key) => key.replace('profile_', ''));

    setUsers(foundUsers);
  }, [navigate, username]);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    const existing = JSON.parse(localStorage.getItem('kashi_user_products')) || [];
    const updated = existing.filter((p) => p.id !== id);
    localStorage.setItem('kashi_user_products', JSON.stringify(updated));

    setProducts(getAllProducts());
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>🛠 Admin Dashboard</h2>

      <div style={{ marginBottom: '20px' }}>
        <strong>👥 Total Users:</strong> {users.length} <br />
        <strong>📦 Total Products:</strong> {products.length}
      </div>

      <h3>All Listings</h3>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '8px',
                background: '#f9f9f9',
              }}
            >
              <img
                src={p.images?.[0] || p.image}
                alt={p.title}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px' }}
              />
              <h4 style={{ margin: '10px 0 5px' }}>{p.title}</h4>
              <p style={{ margin: '0 0 5px' }}>{p.price}</p>
              <p style={{ fontSize: '14px', color: '#666' }}>Posted by: <strong>{p.username}</strong></p>
              <button
                onClick={() => handleDelete(p.id)}
                style={{
                  marginTop: '8px',
                  backgroundColor: '#E38648',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
