import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../data/productManager';
import { supabase } from '../data/supabaseClient';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    getAllProducts().then((products) => {
      const found = products.find((p) => p.id.toString() === id);
      setProduct(found);
    });

    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('product_id', id)
      .order('created_at', { ascending: true });

    if (!error) setComments(data);
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return alert('Not logged in');

    const { data: profile } = await supabase
      .from('users')
      .select('username, photo')
      .eq('email', user.email)
      .single();

    const username = profile?.username || user.email;
    let avatar = profile?.photo;

    if (!avatar || !avatar.startsWith('http')) {
      avatar = `https://api.dicebear.com/6.x/personas/svg?seed=${encodeURIComponent(username)}`;
    }

    const { error } = await supabase.from('comments').insert({
      product_id: id,
      username,
      comment: newComment.trim(),
      avatar,
    });

    if (!error) {
      setNewComment('');
      fetchComments();
    }
  };

  const handleNext = () => {
    if (product?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const handlePrev = () => {
    if (product?.images?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (!product) {
    return <h2 style={{ padding: '20px', color: 'var(--text)' }}>Product not found</h2>;
  }

  const images = product.images || [];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: 'var(--text)' }}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>← Back</button>

      {/* Image Carousel */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <img
          src={images[currentImageIndex]}
          alt={`product-img-${currentImageIndex}`}
          style={{ width: '100%', borderRadius: '10px', maxHeight: 400, objectFit: 'cover' }}
        />
        {images.length > 1 && (
          <>
            <button onClick={handlePrev} style={carouselBtn('left')}>←</button>
            <button onClick={handleNext} style={carouselBtn('right')}>→</button>
          </>
        )}
      </div>

      <h2>{product.title}</h2>
      <p style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{product.price}</p>
      <p>{product.description}</p>

      {/* Comments */}
      <div style={{ marginTop: '30px' }}>
        <h4>Comments</h4>
        {comments.length === 0 && <p style={{ color: '#666' }}>No comments yet. Be the first!</p>}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {comments.map((c, i) => (
            <li key={i} style={commentStyle}>
              <img src={c.avatar} alt="avatar" style={avatarStyle} />
              <div>
                <p style={{ margin: 0 }}><strong>@{c.username}</strong>: {c.comment}</p>
                <small style={{ color: '#999' }}>{new Date(c.created_at).toLocaleString()}</small>
              </div>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
            style={inputStyle}
          />
          <button onClick={handlePostComment} style={postButtonStyle}>Post</button>
        </div>
      </div>
    </div>
  );
}

const backButtonStyle = {
  marginBottom: '15px',
  background: 'none',
  border: '1px solid var(--accent)',
  padding: '6px 10px',
  borderRadius: '6px',
  cursor: 'pointer',
  color: 'var(--text)',
};

const inputStyle = {
  flex: 1,
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid var(--accent)',
  color: 'var(--text)',
  backgroundColor: 'var(--bg)',
};

const postButtonStyle = {
  backgroundColor: 'var(--accent)',
  color: '#fff',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '6px',
  cursor: 'pointer',
};

const commentStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  marginBottom: '10px',
  borderBottom: '1px solid #eee',
  paddingBottom: '10px',
};

const avatarStyle = {
  width: 40,
  height: 40,
  borderRadius: '50%',
};

function carouselBtn(position) {
  return {
    position: 'absolute',
    top: '50%',
    [position]: '10px',
    transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.4)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
  };
}
