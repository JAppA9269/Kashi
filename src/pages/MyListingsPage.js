import React from 'react';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../data/productManager';

export default function MyListingsPage() {
  const user = localStorage.getItem('kashi_user');
  const allProducts = getAllProducts();
  const userProducts = allProducts.filter((p) => p.username === user);

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto', color: 'var(--text)' }}>
      <h2>📦 My Listings</h2>
      {userProducts.length === 0 ? (
        <p>You haven’t posted anything yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {userProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
