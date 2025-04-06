// ✅ Always start with imports
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/homepage';
import ProductPage from './pages/productpage';
import SellPage from './pages/sellpage';
import SearchPage from './pages/searchpage';
import ProfilePage from './pages/profilepage';
import MyListingsPage from './pages/MyListingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

import { getTheme, setTheme } from './theme';
setTheme(getTheme()); // Apply theme immediately

function App() {
  const user = localStorage.getItem('kashi_user');

  return (
    <Router>
      <div style={{ paddingBottom: '70px' }}>
        <Routes>
          {/* ✅ Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* ✅ Protected routes */}
          {user ? (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/sell" element={<SellPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/my-listings" element={<MyListingsPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>

        {/* ✅ Navbar only if user is logged in */}
        {user && <Navbar />}
      </div>
    </Router>
  );
}

export default App;
