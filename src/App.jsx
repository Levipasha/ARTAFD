import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import AuthProvider from './contexts/AuthContext';
import Home from './components/Home';
import ArtStore from './components/ArtStore';
import ArtistsPage from './components/ArtistsPage';
import ArtistHub from './components/ArtistHub';
import NFTPage from './components/NFTPage';
import EventsPage from './components/EventsPage';
import AboutPage from './components/AboutPage';
import FirebaseAuth from './components/FirebaseAuth';
import Signup from './components/Signup';
import VirtualGallery3D from './components/VirtualGallery3D';
import Terms from './components/Terms';
import ArtSupplies from './components/ArtSupplies';
import DigitalTools from './components/DigitalTools';
import Workshops from './components/Workshops';
import StudioFinder from './components/StudioFinder';
import Careers from './components/Careers';
import PressKit from './components/PressKit';
import PrivacyPolicy from './components/PrivacyPolicy';
import CookiePolicy from './components/CookiePolicy';
import Disclaimer from './components/Disclaimer';
import ProductManagement from './components/ProductManagement';
import EventManagement from './components/EventManagement';
import AdminDashboard from './components/AdminDashboard';
import UserProfile from './components/UserProfile';
// import Cart from './components/Cart';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/art-store" element={<ArtStore />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/login" element={<FirebaseAuth />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/artist-hub" element={<ArtistHub />} />
            <Route path="/nft" element={<NFTPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/virtual-gallery" element={<VirtualGallery3D />} />
            <Route path="/art-supplies" element={<ArtSupplies />} />
            <Route path="/digital-tools" element={<DigitalTools />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/studio-finder" element={<StudioFinder />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press-kit" element={<PressKit />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/product-management" element={<ProductManagement />} />
            <Route path="/event-management" element={<EventManagement />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
          {/* <Cart /> */}
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
