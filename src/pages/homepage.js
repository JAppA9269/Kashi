import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../data/productManager';

const categories = ['All', 'Women', 'Men', 'Youth', 'Other'];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [brandFilter, setBrandFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllProducts();
      setProducts(data);
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchBrand = brandFilter === '' || (p.brand && p.brand.toLowerCase().includes(brandFilter.toLowerCase()));
    const matchSize = sizeFilter === '' || (p.size && p.size.toLowerCase().includes(sizeFilter.toLowerCase()));
    return matchCategory && matchBrand && matchSize;
  });

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ color: 'var(--text)' }}>🔥 Latest Listings</h2>

      {/* Category filter buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 12px',
              borderRadius: '20px',
              border: selectedCategory === cat ? '2px solid var(--accent)' : '1px solid var(--accent)',
              background: selectedCategory === cat ? 'var(--card)' : 'var(--bg)',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Brand + Size filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Filter by brand"
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid var(--accent)',
            color: 'var(--text)',
            background: 'var(--bg)',
          }}
        />
        <input
          type="text"
          placeholder="Filter by size"
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid var(--accent)',
            color: 'var(--text)',
            background: 'var(--bg)',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {filteredProducts.length === 0 ? (
          <p style={{ color: 'var(--text)' }}>No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
