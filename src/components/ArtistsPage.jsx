import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, User, Camera } from 'lucide-react';
import Navbar from './Navbar';
import { artistsAPI } from '../services/api';

const ArtistsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await artistsAPI.searchArtists({ q: search || undefined, limit: 100 });
        if (!cancelled) setArtists(res.artists || []);
      } catch (e) {
        if (!cancelled) setArtists([]);
        console.error('ArtistsPage fetch error:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    
    // Add a small debounce if typing
    const t = setTimeout(fetch, search ? 300 : 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </button>
          
          <h1 className="text-4xl font-bold text-black mb-2">VERIFIED ARTISTS</h1>
          <p className="text-gray-600 mb-6">Discover and connect with talented creators across India</p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search artists by name, form, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-colors"
            />
          </div>
        </div>
      </div>

      <style>
        {`
          .hover-scale { transition: transform 700ms ease-out; }
          .hover-scale:hover { transform: scale(1.02); }
          .image-scale { transition: transform 700ms ease-out; }
          .image-container:hover .image-scale { transform: scale(1.03); }
          .hover-translate { transition: transform 500ms ease-out; }
          .hover-translate:hover { transform: translateX(4px); }
          .hover-scale-sm { transition: transform 500ms ease-out; }
          .hover-scale-sm:hover { transform: scale(1.1); }
        `}
      </style>

      {/* Artists Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">
              No artists found matching your search.
            </div>
            <button 
              onClick={() => setSearch('')}
              className="text-red-600 font-medium hover:text-red-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artists.map((artist) => (
              <div 
                key={artist._id} 
                className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg dark:shadow-2xl dark:shadow-black/80 overflow-hidden hover-scale"
              >
                <div className="relative overflow-hidden image-container">
                  <img 
                    src={artist?.image?.url || "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg"}
                    alt={artist.name || "Profile"} 
                    className="w-full aspect-square object-cover image-scale bg-gray-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 dark:from-black/60 to-transparent pointer-events-none"></div>
                  <div className="absolute top-6 left-6 right-6">
                    <h2 className="text-2xl font-medium text-white drop-shadow-lg">{artist.name}</h2>
                  </div>
                </div>
                
                <div className="p-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full overflow-hidden hover-scale-sm ring-2 ring-gray-200 dark:ring-zinc-700 flex-shrink-0">
                      <img 
                        src={artist?.image?.url || "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg"}
                        alt={artist.name || "Avatar"} 
                        className="w-full h-full object-cover bg-gray-100"
                      />
                    </div>
                    <div className="hover-translate min-w-0 flex-1">
                      <div className="text-sm font-bold text-gray-700 dark:text-zinc-100">
                        {artist.name}
                      </div>
                      <div className="text-[11px] font-medium text-red-600 dark:text-red-400 uppercase tracking-wider">
                        {artist.artForm || 'Artist'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-zinc-500">
                        {[artist.location?.city, artist.location?.state].filter(Boolean).join(', ') || 'India'}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (artist.social?.instagram) window.open(artist.social.instagram, '_blank');
                      else alert('Contacting ' + artist.name);
                    }}
                    className="bg-gray-900 flex-shrink-0 dark:bg-zinc-800 text-white dark:text-zinc-100 rounded-lg px-4 py-2 text-sm font-medium
                             transition-all duration-500 ease-out transform hover:scale-105 
                             hover:bg-gray-800 dark:hover:bg-zinc-700
                             active:scale-95 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/50"
                  >
                    + Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistsPage;
