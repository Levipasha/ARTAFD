import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Instagram, Facebook, Twitter, Globe, MapPin, Palette, Heart, ExternalLink, Share2, Mail } from 'lucide-react';
import Navbar from './Navbar';
import { artistsAPI, productsAPI } from '../services/api';
import SEO from './SEO';
import Loader from './Loader';

const ArtistProfile = () => {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [artist, setArtist] = useState(null);
  const [activeTab, setActiveTab] = useState('artworks');
  const [likedArtworks, setLikedArtworks] = useState(new Set());
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchArtistAndArtworks = async () => {
      try {
        setLoading(true);
        console.log('Fetching artist with ID:', artistId);
        console.log('API URL being used:', process.env.REACT_APP_API_URL || 'http://localhost:5000/api');
        
        // Get artist from API
        const res = await artistsAPI.getArtist(artistId);
        console.log('Full API response:', res);
        console.log('Response data:', res.data);
        
        let artistData = null;
        
        // The API returns the artist data directly (as we saw from testing)
        if (res.data) {
          artistData = res.data;
          console.log('Artist set successfully from res.data:', res.data.name);
        } else if (res.artist) {
          artistData = res.artist;
          console.log('Artist set successfully from res.artist:', res.artist.name);
        } else if (res) {
          // Sometimes the API might return the data directly as the response
          artistData = res;
          console.log('Artist set successfully from direct response:', res.name);
        } else {
          console.error('No artist data found in response');
          console.log('Response structure:', Object.keys(res || {}));
        }

        if (artistData) {
          // Now fetch artworks linked to this artist from the products collection
          try {
            console.log('Fetching artworks for artist:', artistData._id);
            const productsRes = await productsAPI.getProducts({ artistProfile: artistData._id });
            console.log('Products response:', productsRes);
            
            // Add artworks to the artist data
            const artworks = productsRes.products || productsRes || [];
            
            // Try to get user's liked products to set initial like state
            try {
              const likedProductsRes = await productsAPI.getLikedProducts();
              const likedProductIds = new Set(likedProductsRes.products?.map(p => p._id || p.id) || []);
              setLikedArtworks(likedProductIds);
              
              // Mark artworks as liked based on user's liked products
              const artworksWithLikeStatus = artworks.map(artwork => ({
                ...artwork,
                isLiked: likedProductIds.has(artwork._id || artwork.id)
              }));
              
              artistData.artworks = artworksWithLikeStatus;
            } catch (likedError) {
              console.log('Could not fetch liked products:', likedError);
              artistData.artworks = artworks;
            }
            
            console.log('Found artworks:', artistData.artworks.length);
            setArtist(artistData);
          } catch (artworksError) {
            console.error('Error fetching artworks:', artworksError);
            // Still set the artist even if artworks fail
            artistData.artworks = [];
            setArtist(artistData);
          }
        }
      } catch (error) {
        console.error('Error fetching artist:', error);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        console.error('Error message:', error.message);
        
        // If API fails, try to create a basic artist from the ID for testing
        if (artistId && typeof artistId === 'string') {
          console.log('Creating fallback artist from ID for testing');
          const fallbackArtist = {
            _id: artistId,
            name: artistId.includes('uday') ? 'Uday Kumar Sangisetti' : artistId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            artForm: 'Artist',
            bio: 'Artist profile loading...',
            image: { url: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg" },
            artworks: []
          };
          setArtist(fallbackArtist);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArtistAndArtworks();
  }, [artistId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${artist?.name} - Artist Profile`,
        text: `Check out ${artist?.name}'s amazing artwork!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleLike = async (artworkId) => {
    try {
      // Call the real API to like/unlike the product
      const response = await productsAPI.likeProduct(artworkId);
      console.log('Like response:', response);

      // Update the artist artworks array with the real response
      if (artist && artist.artworks) {
        const updatedArtworks = artist.artworks.map(artwork => {
          if ((artwork._id || artwork.id) === artworkId) {
            // Use the like count from the API response if available, otherwise increment/decrement
            const newLikeCount = response.likes !== undefined 
              ? response.likes 
              : (Array.isArray(artwork.likes) ? artwork.likes.length : (artwork.likes || 0)) + 1;
            
            return {
              ...artwork,
              likes: newLikeCount,
              isLiked: response.isLiked !== undefined ? response.isLiked : true
            };
          }
          return artwork;
        });
        setArtist({ ...artist, artworks: updatedArtworks });
      }

      // Update local liked state
      const newLikedArtworks = new Set(likedArtworks);
      if (likedArtworks.has(artworkId)) {
        newLikedArtworks.delete(artworkId);
      } else {
        newLikedArtworks.add(artworkId);
      }
      setLikedArtworks(newLikedArtworks);

    } catch (error) {
      console.error('Error liking artwork:', error);
      // If API fails, fallback to local state update
      const newLikedArtworks = new Set(likedArtworks);
      if (likedArtworks.has(artworkId)) {
        newLikedArtworks.delete(artworkId);
      } else {
        newLikedArtworks.add(artworkId);
      }
      setLikedArtworks(newLikedArtworks);

      if (artist && artist.artworks) {
        const updatedArtworks = artist.artworks.map(artwork => {
          if ((artwork._id || artwork.id) === artworkId) {
            const currentLikes = Array.isArray(artwork.likes) ? artwork.likes.length : (artwork.likes || 0);
            return {
              ...artwork,
              likes: newLikedArtworks.has(artworkId) ? currentLikes + 1 : currentLikes - 1,
              isLiked: newLikedArtworks.has(artworkId)
            };
          }
          return artwork;
        });
        setArtist({ ...artist, artworks: updatedArtworks });
      }
    }
  };

  const handleImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  const handleContact = () => {
    // Implement contact functionality
    alert(`Contact ${artist?.name} through their social media or email`);
  };

  if (loading) {
    return (
      <>
        <SEO title="Loading Artist Profile" />
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
          <Navbar />
          <div className="flex-grow flex items-center justify-center">
            <Loader size={120} />
          </div>
        </div>
      </>
    );
  }

  if (!artist) {
    return (
      <>
        <SEO title="Artist Not Found" />
        <div className="min-h-screen bg-black flex flex-col">
          <Navbar />
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                <Palette size={32} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-white mb-4">Artist not found</h2>
              <p className="text-gray-400 mb-8">
                We couldn't find the artist you're looking for. They may not have a profile yet or the link might be incorrect.
              </p>
              <button 
                onClick={() => navigate('/artists')}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-full font-black hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 border border-red-500/30"
              >
                Browse All Artists
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title={`${artist.name} - Artist Profile`}
        description={`Discover ${artist.name}'s amazing ${artist.artForm} artworks. Connect with the artist and explore their creative portfolio.`}
        canonical={`https://artartist.com/artist/${artist._id}`}
      />
      
      <div className="min-h-screen bg-black">
        <Navbar />

        {/* Hero Section */}
        <div className="relative">
          {/* Cover Image */}
          <div className="h-64 md:h-80 bg-gradient-to-br from-black via-red-900 to-red-600 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            
            {/* Back Button */}
            <button 
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-red-500/30 text-white px-4 py-2 rounded-full shadow-lg hover:bg-black hover:border-red-500 transition-all duration-300"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back</span>
            </button>

            {/* Share Button */}
            <button 
              onClick={handleShare}
              className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-red-500/30 text-white px-4 py-2 rounded-full shadow-lg hover:bg-black hover:border-red-500 transition-all duration-300"
            >
              <Share2 size={18} />
              <span className="font-medium">Share</span>
            </button>
          </div>

          {/* Profile Info */}
          <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
            <div className="bg-gray-900 border border-red-500/30 rounded-3xl shadow-2xl p-6 md:p-8 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img 
                      src={artist.image?.url || "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg"}
                      alt={artist.name}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-red-500/50 shadow-2xl"
                    />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-red-600 rounded-full border-4 border-gray-900"></div>
                  </div>
                </div>

                {/* Artist Details */}
                <div className="flex-grow">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">{artist.name || 'Artist'}</h1>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                        <Palette size={16} className="text-red-500" />
                        <span className="font-medium">{artist.artForm || artist.specialty || 'Artist'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                        <MapPin size={16} className="text-gray-500" />
                        <span>{[artist.location?.city, artist.location?.state, artist.location?.country].filter(Boolean).join(', ') || artist.city || 'India'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-300 mt-4 leading-relaxed">
                    {artist.bio || artist.description || artist.about || 'No bio available for this artist.'}
                  </p>

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    {artist.social?.instagram && (
                      <a 
                        href={artist.social.instagram.startsWith('http') ? artist.social.instagram : `https://instagram.com/${artist.social.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full border border-red-500/30 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
                      >
                        <Instagram size={18} />
                        <span className="font-medium">Instagram</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {artist.social?.facebook && (
                      <a 
                        href={artist.social.facebook.startsWith('http') ? artist.social.facebook : `https://facebook.com/${artist.social.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-700 hover:border-gray-600 hover:shadow-lg transition-all duration-300"
                      >
                        <Facebook size={18} />
                        <span className="font-medium">Facebook</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {artist.social?.twitter && (
                      <a 
                        href={artist.social.twitter.startsWith('http') ? artist.social.twitter : `https://twitter.com/${artist.social.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-700 hover:border-gray-600 hover:shadow-lg transition-all duration-300"
                      >
                        <Twitter size={18} />
                        <span className="font-medium">Twitter</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {artist.social?.website && (
                      <a 
                        href={artist.social.website.startsWith('http') ? artist.social.website : `https://${artist.social.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-700 hover:border-gray-600 hover:shadow-lg transition-all duration-300"
                      >
                        <Globe size={18} />
                        <span className="font-medium">Website</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {artist.social?.linkedin && (
                      <a 
                        href={artist.social.linkedin.startsWith('http') ? artist.social.linkedin : `https://linkedin.com/in/${artist.social.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-700 hover:border-gray-600 hover:shadow-lg transition-all duration-300"
                      >
                        <Globe size={18} />
                        <span className="font-medium">LinkedIn</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button 
                      onClick={handleContact}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full border border-red-500/30 hover:bg-red-700 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
                    >
                      <Mail size={18} />
                      <span className="font-medium">Contact</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 bg-gray-900/50 backdrop-blur-sm p-1 rounded-xl w-fit border border-red-500/20">
            <button 
              onClick={() => setActiveTab('artworks')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'artworks' 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              Artworks
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'about' 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              About
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {activeTab === 'artworks' && (
            <>
              {artist.artworks && artist.artworks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artist.artworks.map((artwork) => (
                    <div key={artwork._id || artwork.id} className="bg-gray-900 border border-red-500/20 rounded-2xl overflow-hidden hover:border-red-500/40 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 group">
                      <div className="relative overflow-hidden">
                        <img 
                          src={
                            artwork.images && artwork.images.length > 0 
                              ? artwork.images[0].url || artwork.images[0] 
                              : artwork.image?.url || artwork.image || "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg"
                          }
                          alt={artwork.name || artwork.title || 'Artwork'}
                          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                          onClick={() => handleImagePreview(
                            artwork.images && artwork.images.length > 0 
                              ? artwork.images[0].url || artwork.images[0] 
                              : artwork.image?.url || artwork.image || "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg"
                          )}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        {artwork.status === 'available' && (
                          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black border border-red-500">
                            AVAILABLE
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-black text-white mb-4">{artwork.name || artwork.title || 'Untitled'}</h3>
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => handleLike(artwork._id || artwork.id)}
                            className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Heart 
                              size={16} 
                              className={
                                artwork.isLiked || likedArtworks.has(artwork._id || artwork.id) 
                                  ? "text-red-500 fill-red-500" 
                                  : "text-gray-400"
                              }
                            />
                            <span className="text-sm font-medium">
                              {Array.isArray(artwork.likes) ? artwork.likes.length : (artwork.likes || 0)}
                            </span>
                          </button>
                          <div className="flex items-center gap-2">
                            {artwork.views && (
                              <span className="text-xs text-gray-500">
                                {artwork.views} views
                              </span>
                            )}
                            <button 
                              onClick={() => {
                                // Navigate to product details or show modal
                                console.log('View artwork details:', artwork._id);
                              }}
                              className="text-red-400 hover:text-red-300 font-black text-sm transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-900 border border-red-500/20 rounded-3xl max-w-3xl mx-auto">
                  <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                    <Palette size={32} className="text-red-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">No artworks yet</h3>
                  <p className="text-gray-400 mb-8">
                    {artist.name} hasn't added any artworks to their profile yet.
                  </p>
                  <button 
                    onClick={() => navigate('/artists')}
                    className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-full font-black hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 border border-red-500/30"
                  >
                    Browse Other Artists
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'about' && (
            <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-black text-white mb-6">About {artist.name}</h2>
              <div className="space-y-6 text-gray-300">
                <div>
                  <h3 className="text-lg font-black text-red-400 mb-3">Artist Statement</h3>
                  <p className="leading-relaxed">
                    {artist.bio || artist.description || artist.about || 'No artist statement available.'}
                  </p>
                </div>
                
                {(artist.artForm || artist.specialty) && (
                  <div>
                    <h3 className="text-lg font-black text-red-400 mb-3">Specialization</h3>
                    <p className="leading-relaxed">
                      {artist.name} specializes in {(artist.artForm || artist.specialty).toLowerCase()}, creating unique pieces that 
                      showcase their artistic vision and technical skill.
                    </p>
                  </div>
                )}

                {artist.isTeamMember && (
                  <div>
                    <h3 className="text-lg font-black text-red-400 mb-3">Team Role</h3>
                    <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
                      <p className="text-red-400 font-black">{artist.teamRole || 'Team Member'}</p>
                      <p className="text-red-500 text-sm mt-1">Part of the ArtArtist core team</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-black text-red-400 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    {artist.email && (
                      <p><span className="text-gray-500">Email:</span> <span className="text-white">{artist.email}</span></p>
                    )}
                    {artist.phone && (
                      <p><span className="text-gray-500">Phone:</span> <span className="text-white">{artist.phone}</span></p>
                    )}
                    {!artist.email && !artist.phone && (
                      <p className="text-gray-500">Contact through social media channels</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-red-400 mb-3">Location</h3>
                  <p className="text-white">
                    {[artist.location?.city, artist.location?.state, artist.location?.country].filter(Boolean).join(', ') || 'Location not specified'}
                  </p>
                </div>

                {!artist.bio && !artist.description && !artist.about && !artist.artForm && !artist.specialty && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      More information about {artist.name} will be available soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeImagePreview}
        >
          <div
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Artwork preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={closeImagePreview}
              className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ArtistProfile;
