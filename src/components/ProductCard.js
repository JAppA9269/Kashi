import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const images = product.images || (product.image ? [product.image] : []);
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [hovered, setHovered] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('kashi_show_thumbnails');
    setShowThumbnails(stored === 'true'); // OFF by default unless enabled
  }, []);

  const previewImage = hovered && images.length > 1 ? images[1] : selectedImage;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        position: 'relative',
        border: '1px solid var(--card)',
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundColor: 'var(--card)',
        color: 'var(--text)',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease',
      }}
    >
      {/* Brand & Size badge */}
      {(product.brand || product.size) && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: '#fff',
            color: '#333',
            padding: '4px 8px',
            borderRadius: '5px',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            zIndex: 2,
          }}
        >
          {product.brand && <span>{product.brand}</span>}
          {product.brand && product.size && <span> • </span>}
          {product.size && <span>{product.size}</span>}
        </div>
      )}

      {/* Main image with hover preview */}
      <img
        src={previewImage}
        alt={product.title}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
      />

      {/* Thumbnails if setting is ON */}
      {showThumbnails && images.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '6px',
            padding: '6px 10px',
            overflowX: 'auto',
            backgroundColor: '#f9f9f9',
          }}
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`thumb-${index}`}
              onClick={(e) => {
                e.stopPropagation(); // avoid card click
                setSelectedImage(img);
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: '4px',
                border: img === selectedImage ? '2px solid #E38648' : '1px solid #ccc',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      )}

      <div style={{ padding: '10px' }}>
        <h4 style={{ margin: '0 0 5px 0' }}>{product.title}</h4>
        <p style={{ margin: 0, color: '#E38648', fontWeight: 'bold' }}>{product.price}</p>
      </div>
    </div>
  );
}
