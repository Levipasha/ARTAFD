import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import AuthProvider from './contexts/AuthContext';
import Home from './components/Home';
import ArtStore from './components/ArtStore';
import Login from './components/Login';
import ArtistHub from './components/ArtistHub';
import NFTPage from './components/NFTPage';
import EventsPage from './components/EventsPage';
import AboutPage from './components/AboutPage';
import FirebaseAuth from './components/FirebaseAuth';
import VirtualGallery3D from './components/VirtualGallery3D';
// import AdminDashboard from './components/AdminDashboard';
// import Cart from './components/Cart';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/art-store" element={<ArtStore />} />
            <Route path="/login" element={<FirebaseAuth />} />
            <Route path="/artist-hub" element={<ArtistHub />} />
            <Route path="/nft" element={<NFTPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/virtual-gallery" element={<VirtualGallery3D />} />
            {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          </Routes>
          {/* <Cart /> */}
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
