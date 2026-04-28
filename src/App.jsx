import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
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
import UserDashboard from './components/UserDashboard';
import PageLoader from './components/PageLoader';
// import Cart from './components/Cart';

// Wrapper component to add loader to each route
const RouteWithLoader = ({ element }) => {
  return (
    <PageLoader>
      {element}
    </PageLoader>
  );
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<RouteWithLoader element={<Home />} />} />
              <Route path="/art-store" element={<RouteWithLoader element={<ArtStore />} />} />
              <Route path="/artists" element={<RouteWithLoader element={<ArtistsPage />} />} />
              <Route path="/login" element={<RouteWithLoader element={<FirebaseAuth />} />} />
              <Route path="/signup" element={<RouteWithLoader element={<Signup />} />} />
              <Route path="/artist-hub" element={<RouteWithLoader element={<ArtistHub />} />} />
              <Route path="/nft" element={<RouteWithLoader element={<NFTPage />} />} />
              <Route path="/events" element={<RouteWithLoader element={<EventsPage />} />} />
              <Route path="/about" element={<RouteWithLoader element={<AboutPage />} />} />
              <Route path="/terms" element={<RouteWithLoader element={<Terms />} />} />
              <Route path="/virtual-gallery" element={<RouteWithLoader element={<VirtualGallery3D />} />} />
              <Route path="/art-supplies" element={<RouteWithLoader element={<ArtSupplies />} />} />
              <Route path="/digital-tools" element={<RouteWithLoader element={<DigitalTools />} />} />
              <Route path="/workshops" element={<RouteWithLoader element={<Workshops />} />} />
              <Route path="/studio-finder" element={<RouteWithLoader element={<StudioFinder />} />} />
              <Route path="/careers" element={<RouteWithLoader element={<Careers />} />} />
              <Route path="/press-kit" element={<RouteWithLoader element={<PressKit />} />} />
              <Route path="/privacy-policy" element={<RouteWithLoader element={<PrivacyPolicy />} />} />
              <Route path="/cookie-policy" element={<RouteWithLoader element={<CookiePolicy />} />} />
              <Route path="/disclaimer" element={<RouteWithLoader element={<Disclaimer />} />} />
              <Route path="/product-management" element={<RouteWithLoader element={<ProductManagement />} />} />
              <Route path="/event-management" element={<RouteWithLoader element={<EventManagement />} />} />
              <Route path="/admin" element={<RouteWithLoader element={<AdminDashboard />} />} />
              <Route path="/profile" element={<RouteWithLoader element={<UserProfile />} />} />
              <Route path="/dashboard" element={<RouteWithLoader element={<UserDashboard />} />} />
            </Routes>
            {/* <Cart /> */}
          </Router>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
