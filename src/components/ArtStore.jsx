import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';

import { Filter, Search, ArrowLeft, MapPin, X, User, ChevronRight, Instagram, Facebook, Globe, MessageSquare, Share2, Heart, Link as LinkIcon, Palette } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { productsAPI } from '../services/api';
import SEO from './SEO';

const normalizeCategory = (value = '') => String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
const pillToCategory = {
  'Painting': ['painting'],
  'Digital Art': ['digitalart', 'digital'],
  'Sculpture': ['sculpture'],
  'Photography': ['photography', 'photo'],
  'Print': ['print', 'prints'],
  'Supplies': ['supplies', 'supply'],
  'Other': ['other'],
};

const pillToBackendCategory = {
  'Painting': 'painting',
  'Digital Art': 'digitalart',
  'Sculpture': 'sculpture',
  'Photography': 'photography',
  'Print': 'print',
  'Supplies': 'supplies',
  'Other': 'other',
};

const ArtStore = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPill, setSelectedPill] = useState('All');
  const [previewItem, setPreviewItem] = useState(null);
  const [previewArtist, setPreviewArtist] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef(null);

  // Reset and fetch page 1 whenever search or pill changes
  useEffect(() => {
    let cancelled = false;
    
    const fetchInitial = async () => {
      try {
        setLoading(true);
        setPage(1);
        setHasMore(true);

        const backendCategory = selectedPill !== 'All' ? pillToBackendCategory[selectedPill] : undefined;
        
        const res = await productsAPI.getProducts({ 
          page: 1, 
          limit: 20, 
          search: search || undefined,
          category: backendCategory
        });

        if (!cancelled) {
          const newProducts = res.products || [];
          setProducts(newProducts);
          setHasMore(newProducts.length >= 20);
        }
      } catch (e) {
        console.error('ArtStore initial fetch error:', e);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchInitial();

    return () => {
      cancelled = true;
    };
  }, [search, selectedPill]);

  const loadMoreProducts = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const backendCategory = selectedPill !== 'All' ? pillToBackendCategory[selectedPill] : undefined;

      const res = await productsAPI.getProducts({
        page: nextPage,
        limit: 20,
        search: search || undefined,
        category: backendCategory
      });

      const newProducts = res.products || [];
      
      setProducts(prev => {
        const existingIds = new Set(prev.map(p => p._id));
        const uniqueNew = newProducts.filter(p => !existingIds.has(p._id));
        return [...prev, ...uniqueNew];
      });

      setPage(nextPage);
      setHasMore(newProducts.length >= 20);
    } catch (e) {
      console.error('ArtStore load more error:', e);
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, hasMore, page, search, selectedPill]);

  useEffect(() => {
    if (loading || !hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loading, loadingMore, hasMore, loadMoreProducts]);

  const pills = ['All', 'Painting', 'Digital Art', 'Sculpture', 'Photography', 'Print', 'Supplies', 'Other'];

  const filteredProducts = useMemo(() => {
    if (selectedPill === 'All') return products;
    const acceptedCategories = pillToCategory[selectedPill];
    if (!acceptedCategories) return products;
    return products.filter((p) => {
      const productCategory = normalizeCategory(p?.category);
      return acceptedCategories.includes(productCategory);
    });
  }, [products, selectedPill]);

  const getArtistData = (product) => {
    if (product?.artistProfile) {
      return {
        name: product.artistProfile.name || 'Unknown Artist',
        imageUrl: product.artistProfile.image?.url || '',
        imageAlt: product.artistProfile.image?.alt || product.artistProfile.name || 'Artist',
        artForm: product.artistProfile.artForm || '',
        bio: product.artistProfile.bio || '',
        location: [product.artistProfile.location?.city, product.artistProfile.location?.state, product.artistProfile.location?.country]
          .filter(Boolean)
          .join(', '),
        social: product.artistProfile.social || {}
      };
    }

    return {
      name: product?.artist?.displayName || 'Unknown Artist',
      imageUrl: product?.artist?.photoURL || '',
      imageAlt: product?.artist?.displayName || 'Artist',
      artForm: '',
      bio: '',
      location: '',
      social: {}
    };
  };

  const handleShare = async (product) => {
    if (!product) return;
    const shareData = {
      title: product.name,
      text: `Check out "${product.name}" by ${getArtistData(product).name} on Art Showcase!`,
      url: window.location.origin + '/art', // Sharing the art page
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
  };

  return (
    <>
      <SEO 
        title="Art Store"
        description="Browse and buy original paintings, digital art, and artwork from emerging and established artists. Secure transactions, worldwide shipping."
        keywords="art store, buy paintings, buy digital art, online art gallery, artwork for sale"
        canonical="https://artartist.com/art"
      />
      <div className="min-h-screen bg-white">

      {/* Header */}
      <div className="bg-black py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="w-full max-w-6xl mx-auto text-center">
          {/* Back Button */}
          <div className="flex justify-start mb-4">
            <Link 
              to="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold mb-2"><span className="text-white">ART </span><span className="text-red-600">SHOWCASE</span></h1>
          <p className="text-gray-300">Explore posted artworks from community</p>
          

        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for art, artists, or styles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:border-red-500 focus:bg-white transition-all"
              />
            </div>
            
            <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
              <Filter size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {pills.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedPill(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  category === selectedPill
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid - Pinterest Style Masonry */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
            {filteredProducts.map((product) => {
              const imageUrl = product?.images?.[0]?.url;
              // Generate random height for Pinterest-like masonry effect
              const randomHeight = Math.floor(Math.random() * 150) + 200; // 200-350px height
              
              return (
                <div key={product._id} className="break-inside-avoid mb-4 group cursor-pointer">
                  {/* Product Card */}
                  <div
                    className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
                    onClick={() => setPreviewItem(product)}
                  >
                    {/* Image Container */}
                    <div className="relative">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={product.name}
                          className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          style={{ height: `${randomHeight}px` }}
                        />
                      ) : (
                        <div className="w-full flex items-center justify-center text-gray-400 bg-gray-100" style={{ height: `${randomHeight}px` }}>
                          <div className="text-center">
                            <div className="mb-2">
                              <Palette size={40} strokeWidth={1.5} />
                            </div>
                            <div className="text-sm font-medium">No image</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 shadow-sm">
                              <Heart size={14} fill="currentColor" />
                            </div>
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-700 shadow-sm">
                              <MessageSquare size={14} />
                            </div>
                          </div>
                          <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-700 shadow-sm">
                            <LinkIcon size={14} />
                          </div>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-xs font-medium rounded-full shadow-sm">
                          {String(product.category || '').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {product?.artistProfile?.image?.url || product?.artist?.photoURL ? (
                            <img 
                              src={product?.artistProfile?.image?.url || product?.artist?.photoURL} 
                              alt="Artist"
                              className="w-6 h-6 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border border-gray-100">
                              <User size={12} />
                            </div>
                          )}
                          <span className="text-xs text-gray-600">
                            {product?.artistProfile?.name || product?.artist?.displayName || 'Unknown Artist'}
                          </span>
                        </div>
                      </div>
                      
                      {product.description && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Infinite Scroll Observer Target */}
        <div ref={observerTarget} className="w-full flex flex-col items-center justify-center py-10 mt-6 border-t border-gray-100">
          {loadingMore && (
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider animate-pulse">Loading more artworks...</p>
            </div>
          )}
          {!hasMore && products.length > 0 && (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Palette size={24} className="text-gray-300 animate-bounce" />
              <p className="text-xs font-bold uppercase tracking-widest">You've reached the end of the collection</p>
            </div>
          )}
        </div>
      </div>

      {/* Showcase Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setPreviewItem(null)} />
          
          <div className="relative bg-white w-full max-w-6xl h-[95vh] md:h-[85vh] mx-auto rounded-t-[32px] md:rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-500 scale-in-center">
            {/* Left: Image Side */}
            <div className="md:w-3/5 lg:w-2/3 h-[45vh] md:h-full bg-neutral-950 flex items-center justify-center relative group">
              <img
                src={previewItem?.images?.[0]?.url}
                alt={previewItem?.name}
                className="w-full h-full object-contain md:object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
              
              <div className="absolute top-6 right-6 flex gap-3 z-10">
                <button
                  onClick={() => handleShare(previewItem)}
                  className="w-12 h-12 bg-black/40 backdrop-blur-xl hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all border border-white/20"
                  title="Share Artwork"
                >
                  <Share2 size={24} />
                </button>
              </div>
              
              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-6 left-6 w-12 h-12 bg-black/40 backdrop-blur-xl hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all md:hidden z-10 border border-white/20"
              >
                <X size={24} />
              </button>
            </div>

            {/* Right: Details Side */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
              {/* Header */}
              <div className="p-5 md:p-8 border-b border-gray-50 flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                        {previewItem.category}
                      </span>
                      {previewItem.status === 'available' && (
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">
                          Available
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4 md:mb-1">{previewItem.name}</h2>
                  </div>
                  <div className="hidden md:flex gap-2 ml-4">
                    <button
                      onClick={() => handleShare(previewItem)}
                      className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                      title="Share Artwork"
                    >
                      <Share2 size={20} />
                    </button>
                    <button
                      onClick={() => setPreviewItem(null)}
                      className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Mobile Priority Info - Always visible without scroll */}
                <div className="space-y-4 md:hidden">
                  <button
                    onClick={() => setPreviewArtist(getArtistData(previewItem))}
                    className="w-full flex items-center gap-3 bg-neutral-50 p-3 rounded-2xl border border-neutral-100 text-left active:scale-[0.98] transition-transform duration-200 cursor-pointer"
                  >
                    <div className="relative">
                      {getArtistData(previewItem).imageUrl ? (
                        <img
                          src={getArtistData(previewItem).imageUrl}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400">
                          <User size={18} />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[8px] font-black text-red-600 uppercase tracking-widest mb-0.5">Created By</div>
                      <div className="font-bold text-sm text-gray-900 truncate">
                        {getArtistData(previewItem).name}
                      </div>
                      <div className="text-[9px] text-gray-500 flex items-center gap-1 truncate">
                        <MapPin size={8} />
                        {getArtistData(previewItem).location}
                      </div>
                    </div>
                  </button>
                  <div>
                    <h3 className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">The Story Behind</h3>
                    <p className="text-gray-600 text-xs font-medium line-clamp-2 leading-relaxed">
                      {previewItem.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Scrollable Content (Hidden on mobile as it's now in header) */}
              <div className="hidden md:block flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8 custom-scrollbar">
                {/* Artist Info */}
                <div className="bg-neutral-50 rounded-[24px] p-5 md:p-6 border border-neutral-100">
                  <button
                    onClick={() => setPreviewArtist(getArtistData(previewItem))}
                    className="flex items-center gap-4 w-full group text-left"
                  >
                    <div className="relative">
                      {getArtistData(previewItem).imageUrl ? (
                        <img
                          src={getArtistData(previewItem).imageUrl}
                          alt={getArtistData(previewItem).imageAlt}
                          className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500 shadow-inner">
                          <User size={24} />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-0.5">Created By</div>
                      <div className="font-bold text-lg text-gray-900 truncate group-hover:text-red-600 transition-colors">
                        {getArtistData(previewItem).name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={10} />
                        {getArtistData(previewItem).location || 'Global Artist'}
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">The Story Behind</h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base font-medium">
                    {previewItem.description || "No description provided for this artwork."}
                  </p>
                </div>

                {/* Tags/Details */}
                {previewItem.tags && previewItem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4">
                    {previewItem.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer: Contact */}
              <div className="p-6 md:p-8 bg-white border-t border-gray-100 mt-auto shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login', { state: { from: '/art' } });
                      return;
                    }

                    const artistInfo = previewItem?.artistProfile || previewItem?.artist;
                    if (artistInfo) {
                      navigate('/dashboard', { 
                        state: { 
                          startChatWith: {
                            _id: artistInfo._id,
                            name: artistInfo.name || artistInfo.displayName,
                            image: artistInfo.image?.url || artistInfo.photoURL,
                            email: artistInfo.email
                          } 
                        } 
                      });
                    } else {
                      alert('Artist contact information not available');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-5 rounded-2xl font-black transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/30 active:scale-95 group"
                >
                  <MessageSquare className="w-5 h-5 group-hover:animate-bounce" />
                  <span>DM Artist for Inquiries</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewArtist && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" onClick={() => setPreviewArtist(null)} />
          <div className="relative bg-white w-full max-w-md max-h-[90vh] mx-auto rounded-[40px] shadow-2xl overflow-hidden flex flex-col scale-in-center">
            {/* Profile Cover */}
            <div className="h-32 bg-gradient-to-br from-red-600 to-red-800 relative">
              <button
                onClick={() => setPreviewArtist(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="px-8 pb-8 flex flex-col items-center">
              {/* Profile Image */}
              <div className="relative -mt-16 mb-4">
                {previewArtist.imageUrl ? (
                  <img
                    src={previewArtist.imageUrl}
                    alt={previewArtist.imageAlt}
                    className="w-32 h-32 rounded-[32px] object-cover border-8 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-[32px] bg-gray-100 flex items-center justify-center text-gray-400 border-8 border-white shadow-xl">
                    <User size={48} />
                  </div>
                )}
                <div className="absolute -bottom-1 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                </div>
              </div>

              {/* Name & Title */}
              <h2 className="text-2xl font-black text-gray-900 mb-1">{previewArtist.name}</h2>
              <p className="text-red-600 font-bold text-sm mb-4 uppercase tracking-widest">{previewArtist.artForm || 'Artist'}</p>
              
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-6">
                <MapPin size={14} className="text-red-500" />
                <span>{previewArtist.location || 'Based in India'}</span>
              </div>



              {/* Bio */}
              <div className="w-full mb-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Biography</h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                  {previewArtist.bio || 'This artist has not added a bio yet.'}
                </p>
              </div>

              {/* Socials & Action */}
              <div className="w-full space-y-4">
                <div className="flex justify-center gap-3">
                  {previewArtist.social?.instagram && (
                    <a href={previewArtist.social.instagram.startsWith('http') ? previewArtist.social.instagram : `https://instagram.com/${previewArtist.social.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-900 transition-all">
                      <Instagram size={18} />
                    </a>
                  )}
                  {previewArtist.social?.facebook && (
                    <a href={previewArtist.social.facebook.startsWith('http') ? previewArtist.social.facebook : `https://facebook.com/${previewArtist.social.facebook}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-900 transition-all">
                      <Facebook size={18} />
                    </a>
                  )}
                  {previewArtist.social?.twitter && (
                    <a href={previewArtist.social.twitter.startsWith('http') ? previewArtist.social.twitter : `https://x.com/${previewArtist.social.twitter}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-900 transition-all" title="X">
                      <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-black fill-current">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                  {previewArtist.social?.website && (
                    <a href={previewArtist.social.website.startsWith('http') ? previewArtist.social.website : `https://${previewArtist.social.website}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-900 transition-all">
                      <Globe size={18} />
                    </a>
                  )}
                </div>

                <button 
                  onClick={() => window.location.href = `/artist/${previewItem?.artistProfile?._id || previewItem?.artist?._id}`}
                  className="w-full bg-black text-white py-4 rounded-2xl font-black transition-all hover:bg-neutral-800 shadow-xl active:scale-[0.98]"
                >
                  View Full Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default ArtStore;
