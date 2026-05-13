import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Mic, MapPin, Palette } from 'lucide-react';
import Navbar from './Navbar';
import { artistsAPI } from '../services/api';
import SEO from './SEO';
import Loader from './Loader';
import Footer from './Footer';
import Chatbot from './Chatbot';
import ComingSoonBanner from './ComingSoonBanner';

const ArtistsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState('');
  const [isListening, setIsListening] = useState(false);

  
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearch(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      if (!search.trim()) {
        if (!cancelled) {
          setArtists([]);
          setLoading(false);
        }
        return;
      }
      try {
        setLoading(true);
        const res = await artistsAPI.searchArtists({ q: search.trim(), limit: 100 });
        if (!cancelled) setArtists(res.artists || []);
      } catch (e) {
        if (!cancelled) setArtists([]);
        console.error('ArtistsPage fetch error:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    
    const t = setTimeout(fetch, search.trim() ? 400 : 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [search]);

  return (
    <>
      <SEO 
        title="Indian Artists - ArtArtist"
        description="Explore profiles of talented Indian artists across various art forms. Connect with artists, view portfolios, and commission custom artwork."
        keywords="indian artists, artist profiles, find artists, artist directory, commission art"
        canonical="https://artartist.com/artists"
      />
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Navbar />

        {/* Dynamic Header Area */}
        <div className={`bg-white transition-all duration-700 ease-in-out border-b border-gray-100 ${!search.trim() ? 'py-10 md:py-16' : 'py-6 sticky top-0 z-40 shadow-sm'}`}>
          <div className="max-w-5xl mx-auto px-4 flex flex-col items-center">
            
            {/* Back button removed as this is now the landing page */}
            
            {/* Big Logo / Title (Only visible when no search query) */}
            {!search.trim() && (
              <div className="text-center mb-8 transform transition-all duration-700">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 pb-1">
                  <span className="text-black">Discover Amazing </span>
                  <span className="text-red-600">Artists</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                  Search by artist name, art form, or location to find talented creators across India
                </p>
              </div>
            )}

            {/* Google-style Search Bar */}
            <div className="relative w-full max-w-3xl transform transition-all duration-500 z-50">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by artist name, art form, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="block w-full pl-16 pr-16 py-4 md:py-5 bg-white border border-gray-200 rounded-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all duration-300 text-lg md:text-xl text-gray-800 placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button 
                  onClick={startListening}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'text-red-600 bg-red-50 animate-pulse shadow-inner' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                  title="Search by voice"
                >
                  <Mic className={`h-6 w-6 ${isListening ? 'scale-110' : ''}`} />
                </button>
              </div>
            </div>
            
          </div>
        </div>

        <style>
          {`
            .hover-scale { transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 500ms ease; }
            .hover-scale:hover { transform: translateY(-6px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
            .image-scale { transition: transform 700ms cubic-bezier(0.4, 0, 0.2, 1); }
            .image-container:hover .image-scale { transform: scale(1.08); }
            .animation-fade-in { animation: fadeIn 0.8s ease-out forwards; }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>

        {/* Main Content Area */}
        <div className={`flex-grow max-w-7xl mx-auto w-full px-4 ${!search.trim() ? 'py-0' : 'py-8 md:py-12'}`}>
          {!search.trim() ? (
            /* Empty State */
            null
          ) : loading ? (

            /* Loading State */
            <div className="flex flex-col items-center justify-center py-24">
              <Loader size={120} />
              <p className="text-gray-500 font-medium mt-4">Searching for artists...</p>
            </div>
          ) : artists.length === 0 ? (

            /* No Results State */
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-3xl mx-auto mt-8">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No artists found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                We couldn't find any artists matching "{search}". Try searching for a different name, art form, or city.
              </p>
              <button 
                onClick={() => setSearch('')}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-full font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                Clear Search
              </button>
            </div>
          ) : (
            /* Results Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {artists.map((artist) => (
                <div 
                  key={artist._id} 
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover-scale group"
                >
                  <div className="relative overflow-hidden image-container">
                    <img 
                      src={artist?.image?.url || "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg"}
                      alt={artist.name || "Profile"} 
                      className="w-full aspect-square object-cover image-scale bg-gray-100"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-2xl font-bold text-white drop-shadow-md tracking-wide">{artist.name}</h2>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Palette size={16} className="text-red-500" />
                        <span className="font-medium text-gray-800">{artist.artForm || 'Artist'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{[artist.location?.city, artist.location?.state].filter(Boolean).join(', ') || 'India'}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        console.log('Artist data:', artist);
                        const artistId = artist._id || artist.id || artist.name?.replace(/\s+/g, '-').toLowerCase();
                        console.log('Artist ID:', artistId);
                        if (artistId) {
                          navigate(`/artist/${artistId}`);
                        } else {
                          alert('Artist ID not found');
                        }
                      }}
                      className="w-full bg-gray-900 text-white rounded-xl px-4 py-3 text-sm font-semibold
                               transition-all duration-300 hover:bg-red-600 shadow-md hover:shadow-red-600/30
                               active:scale-95 flex justify-center items-center gap-2"
                    >
                      View Artist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coming Soon Art Marketplace Section */}
        {!search.trim() && <ComingSoonBanner />}

        {/* Cards Section - All content from Home page */}
        <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl mx-auto">
            {/* Top Section - Modern Art Supply Store and NFT Launch Side by Side */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Modern Art Supply Store Card */}
              <div className="relative bg-[#0A0A0A] rounded-[24px] p-10 sm:p-12 lg:p-[60px] shadow-2xl hover:scale-[1.02] transition-transform duration-300 ease-out overflow-hidden">
                
                {/* Background Shopping Bag Icon */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[20%] opacity-[0.08] z-0">
                  <svg className="w-64 h-64 lg:w-80 lg:h-80 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>

                {/* Gradient Overlay for Premium Feel */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-red-900/20 pointer-events-none z-0" />
                
                {/* Subtle Noise Texture */}
                <div 
                  className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                  }}
                />

                {/* Main Content */}
                <div className="relative z-10 flex flex-col justify-center h-full">
                  
                  {/* LIVE NOW Badge */}
                  <div className="mb-6 inline-block">
                    <span className="inline-flex items-center px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-full tracking-wider uppercase">
                      <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                      in progress
                    </span>
                  </div>

                  {/* Main Heading */}
                  <h1 className="text-white font-extrabold leading-tight mb-6 uppercase tracking-tight">
                    <span className="block text-3xl sm:text-4xl lg:text-5xl">
                      THE ART
                    </span>
                    <span className="block text-3xl sm:text-4xl lg:text-5xl">
                      SUPPLY STORE
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-lg mb-8 leading-relaxed">
                    Professional grade brushes, canvases, and tools delivered across India with exclusive artist discounts.
                  </p>

                  {/* CTA Button */}
                  <button className="group inline-flex items-center text-red-500 font-bold text-base sm:text-lg hover:text-red-400 transition-all duration-200 hover:translate-x-1">
                    <span className="mr-2">coming soon</span>
                    <svg 
                      className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 8l4 4m0 0l-4 4m4-4H3" 
                      />
                    </svg>
                  </button>

                </div>
              </div>

              {/* NFT Launch Card */}
              <div className="relative text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&h=900&fit=crop")'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-red-900/60 to-black/70" />

                <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">
                  NFT LAUNCH
                </h2>
                
                <p className="text-white/90 mb-3 leading-relaxed">
                  Mint your legacy on the blockchain. Coming Q3 2026.
                </p>
                <p className="text-sm text-white/80 mb-6 leading-relaxed">
                  We are launching curated digital collectibles with creator royalties, verified ownership, and cross-market listing support.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-3 py-1 bg-white/95 text-red-700 rounded-full text-xs font-semibold">
                    Ethereum
                  </span>
                  <span className="px-3 py-1 bg-white/95 text-red-700 rounded-full text-xs font-semibold">
                    Polygon
                  </span>
                  <span className="px-3 py-1 bg-white/95 text-red-700 rounded-full text-xs font-semibold">
                    Creator Royalties
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                  <div className="bg-white/15 border border-white/25 rounded-lg py-2">
                    <div className="text-sm font-bold">100%</div>
                    <div className="text-[10px] text-white/80">Ownership</div>
                  </div>
                  <div className="bg-white/15 border border-white/25 rounded-lg py-2">
                    <div className="text-sm font-bold">24x7</div>
                    <div className="text-[10px] text-white/80">Global Market</div>
                  </div>
                  <div className="bg-white/15 border border-white/25 rounded-lg py-2">
                    <div className="text-sm font-bold">On-chain</div>
                    <div className="text-[10px] text-white/80">Provenance</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-black/80 border border-white/30 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Find Studio, Become Verified Artist, and Virtual Gallery */}
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Card - Find Studio */}
              <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 text-center md:text-left min-w-0">
                <div className="mb-6 flex justify-center md:justify-start">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-black mb-4">
                  FIND STUDIO
                </h2>
                
                <p className="text-gray-700 leading-relaxed">
                  Locate the nearest artist meetup or carnival in real-time.
                </p>
                <p className="text-sm text-gray-500 mt-3">
                  Discover local workshops, exhibition spaces, and nearby artist communities instantly.
                </p>
              </div>

              {/* Middle Card - Become Verified Artist */}
              <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 text-center md:text-left min-w-0">
                <h2 className="text-2xl font-bold text-black mb-4">
                  BECOME A VERIFIED ARTIST
                </h2>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Join 265+ verified professionals and get high-quality client leads with zero commission.
                </p>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => navigate('/artist-hub')}
                    className="w-full bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                  >
                    REGISTER PROFILE
                  </button>
                  
                  <div className="flex justify-center gap-4">
                    <div className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-center min-w-[80px]">
                      <div className="text-xs font-bold text-black">₹1000</div>
                      <div className="text-xs text-gray-600">LIFETIME</div>
                    </div>
                    <div className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-center min-w-[80px]">
                      <div className="text-xs font-bold text-black">0%</div>
                      <div className="text-xs text-gray-600">COMMISSION</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Card - Virtual Gallery */}
              <div className="relative bg-[#0A0A0A] p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden min-w-0">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-transparent to-red-900/20 pointer-events-none" />
                
                {/* Subtle Pattern */}
                <div 
                  className="absolute inset-0 opacity-[0.05] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3Cpath d='M20 20h20v20H20z'/%3E%3C/g%3E%3C/svg%3E")`
                  }}
                />

                <div className="relative z-10">
                  <div className="mb-6">
                    <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full tracking-wider uppercase">
                      EXPLORE NOW
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-4">
                    VIRTUAL GALLERY
                  </h2>
                  
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Experience art like never before in our immersive 3D virtual exhibition space.
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Walk through curated collections, interact with artworks, and attend live virtual exhibitions from anywhere in the world.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/10 border border-white/20 rounded-lg py-2 text-center">
                      <div className="text-sm font-bold text-white">3D</div>
                      <div className="text-[10px] text-gray-400">Experience</div>
                    </div>
                    <div className="bg-white/10 border border-white/20 rounded-lg py-2 text-center">
                      <div className="text-sm font-bold text-white">24/7</div>
                      <div className="text-[10px] text-gray-400">Access</div>
                    </div>
                  </div>
                  
                  <a href="/virtual-gallery" className="block w-full">
                    <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg shadow-red-500/25">
                      ENTER GALLERY
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Chatbot />
      </div>
    </>
  );
};

export default ArtistsPage;
