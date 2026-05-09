import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Mic, MapPin, Palette } from 'lucide-react';
import Navbar from './Navbar';
import { artistsAPI } from '../services/api';
import SEO from './SEO';
import Loader from './Loader';

const ArtistsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState('');
  const [isListening, setIsListening] = useState(false);

  const suggestions = [
    "Abstract Painting", "Digital Portraits", "Pencil Sketch", 
    "Resin Art", "Mural", "Watercolor", "Calligraphy", "Oil Painting",
    "Hyderabad"
  ];

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
        <div className={`bg-white transition-all duration-700 ease-in-out border-b border-gray-100 ${!search.trim() ? 'py-16 md:py-28' : 'py-6 sticky top-0 z-40 shadow-sm'}`}>
          <div className="max-w-5xl mx-auto px-4 flex flex-col items-center">
            
            {/* Back button */}
            <div className="w-full flex justify-start mb-6">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Home</span>
              </button>
            </div>
            
            {/* Big Logo / Title (Only visible when no search query) */}
            {!search.trim() && (
              <div className="text-center mb-10 transform transition-all duration-700">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 pb-2">
                  <span className="text-black">Art</span>
                  <span className="text-red-600">Artist</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto">
                  Discover and connect with talented creators across India
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
        <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
          {!search.trim() ? (
            /* Suggestions State */
            <div className="flex flex-col items-center justify-center pt-4 md:pt-12 animation-fade-in">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Try Searching For</h3>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl">
                {suggestions.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => setSearch(sug)}
                    className="px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 hover:shadow-md transition-all duration-300 text-sm md:text-base font-medium flex items-center gap-2 transform hover:-translate-y-1"
                  >
                    <Search size={16} className="opacity-40" />
                    {sug}
                  </button>
                ))}
              </div>
            </div>
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
      </div>
    </>
  );
};

export default ArtistsPage;
