import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../data/productManager';
import { uploadImages } from '../data/uploadImageToSupabase';

export default function SellPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem('kashi_user') || 'unknown';

  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    brand: '',
    size: '',
    images: []
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setForm({ ...form, price: raw });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const preview = files.map((file) => URL.createObjectURL(file));
    setForm({ ...form, images: preview });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, price, category, brand, size } = form;

    if (!title || !price || !category || !brand || !size || selectedFiles.length === 0) {
      return alert('Please fill all required fields.');
    }

    try {
      setUploading(true);
      const imageUrls = await uploadImages(selectedFiles, username);

      const newProduct = {
        ...form,
        price: price + ' TND',
        username,
        images: imageUrls, // Store URLs from Supabase
      };

      await addProduct(newProduct);
      navigate('/');
    } catch (err) {
      alert('Failed to upload or save product.');
      console.error("🔥 FULL ERROR:", err); // ← This helps debug better
    }
     finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: 'var(--text)' }}>
      <h2>Sell an Item</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input name="title" placeholder="Item Title" value={form.title} onChange={handleChange} required style={inputStyle} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handlePriceChange}
            required
            style={{ ...inputStyle, flex: 1 }}
          />
          <span style={{ color: 'var(--text)', fontWeight: 'bold' }}>TND</span>
        </div>

        <select name="category" value={form.category} onChange={handleChange} required style={inputStyle}>
          <option value="">Select Category</option>
          <option value="Women">Women</option>
          <option value="Men">Men</option>
          <option value="Youth">Youth</option>
          <option value="Other">Other</option>
        </select>

        <input name="brand" placeholder="Brand (e.g. Zara)" value={form.brand} onChange={handleChange} required style={inputStyle} />
        <input name="size" placeholder="Size (e.g. M, 42...)" value={form.size} onChange={handleChange} required style={inputStyle} />

        <input type="file" accept="image/*" onChange={handleImageUpload} multiple required />

        {form.images.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {form.images.map((img, i) => (
              <img key={i} src={img} alt={`preview-${i}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '6px' }} />
            ))}
          </div>
        )}

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={uploading}
          style={{
            backgroundColor: 'var(--accent)',
            color: '#fff',
            padding: '10px',
            border: 'none',
            borderRadius: '6px',
            cursor: uploading ? 'not-allowed' : 'pointer',
          }}
        >
          {uploading ? 'Uploading...' : 'Publish'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid var(--accent)',
  backgroundColor: 'var(--bg)',
  color: 'var(--text)',
};
