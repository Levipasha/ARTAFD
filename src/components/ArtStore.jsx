import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, ArrowLeft, MapPin } from 'lucide-react';
import Navbar from './Navbar';
import { productsAPI } from '../services/api';

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

const ArtStore = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPill, setSelectedPill] = useState('All');
  const [previewItem, setPreviewItem] = useState(null);
  const [previewArtist, setPreviewArtist] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await productsAPI.getProducts({ page: 1, limit: 60, search: search || undefined });
        if (!cancelled) setProducts(res.products || []);
      } catch (e) {
        if (!cancelled) setProducts([]);
        console.error('ArtStore products error:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => {
      cancelled = true;
    };
  }, [search]);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 border-b">
        <div className="w-full max-w-6xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </button>
          
          <h1 className="text-4xl font-bold text-black mb-2">ART SHOWCASE</h1>
          <p className="text-gray-600">Explore posted artworks from the community</p>
          
          {/* Artist Payment Setup Section */}
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800">Artist Payment Setup</h3>
                <p className="text-sm text-red-600 mt-1">Set up your payment method to receive commissions</p>
              </div>
              <button 
                onClick={() => {
                  // Navigate to payment setup page
                  navigate('/payment-setup');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium whitespace-nowrap"
              >
                Set Up Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
            />
          </div>
          
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} />
              <span className="font-medium">Filter</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          {pills.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedPill(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === selectedPill
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const imageUrl = product?.images?.[0]?.url;
              return (
                <div key={product._id} className="group cursor-pointer">
              {/* Product Image */}
              <div
                className="relative overflow-hidden rounded-lg mb-4 bg-gray-100"
                onClick={() => setPreviewItem(product)}
              >
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-full">
                    {String(product.category || '').toUpperCase()}
                  </span>
                </div>

              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-black group-hover:text-red-600 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500">
                  Art by {product?.artistProfile?.name || product?.artist?.displayName || 'Unknown Artist'}
                </p>
                
                <p className="text-xs text-gray-600 line-clamp-2">
                  {product.description}
                </p>
                
              </div>
            </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Previous</button>
            <button className="px-4 py-2 bg-black text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Showcase Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setPreviewItem(null)} />
          <div className="relative bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold text-gray-900 truncate pr-4">{previewItem.name}</div>
              <button
                onClick={() => setPreviewItem(null)}
                className="px-3 py-1 rounded-lg border hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="px-4 py-3 border-b bg-gray-50">
              <button
                onClick={() => setPreviewArtist(getArtistData(previewItem))}
                className="flex items-center gap-3 text-left group"
              >
                {getArtistData(previewItem).imageUrl ? (
                  <img
                    src={getArtistData(previewItem).imageUrl}
                    alt={getArtistData(previewItem).imageAlt}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center text-xs text-gray-600">
                    Art
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-sm text-gray-600">Artist</div>
                  <div className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                    {getArtistData(previewItem).name}
                  </div>
                </div>
              </button>
            </div>
            <div className="bg-black">
              <img
                src={previewItem?.images?.[0]?.url}
                alt={previewItem?.name}
                className="w-full max-h-[75vh] object-contain"
              />
            </div>
            <div className="p-4 text-sm text-gray-700">
              {previewItem.description}
            </div>
            
            {/* Commission/Purchase Section */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Commission This Artwork</h4>
                  <p className="text-sm text-gray-600">Click to purchase or commission this artist</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">
                    {previewItem.price ? `$${previewItem.price}` : 'Contact Artist'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    // Fetch price and redirect to admin payment link
                    const artworkData = {
                      id: previewItem._id,
                      name: previewItem.name,
                      price: previewItem.price,
                      artistId: previewItem.artistId,
                      artistName: previewItem?.artistProfile?.name || 'Unknown Artist'
                    };
                    
                    // Get admin payment link (this would be fetched from admin settings)
                    const adminPaymentLink = 'https://your-admin-payment-gateway.com/pay'; // This should be fetched from admin
                    
                    // Redirect to payment with artwork data using React Router
                    const paymentUrl = `/payment?artwork=${encodeURIComponent(JSON.stringify(artworkData))}`;
                    navigate(paymentUrl);
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Buy Now
                </button>
                
                <button 
                  onClick={() => {
                    // Direct artist contact
                    if (previewItem?.artistProfile?.email) {
                      window.location.href = `mailto:${previewItem.artistProfile.email}?subject=Commission Request for ${previewItem.name}`;
                    } else {
                      alert('Artist contact information not available');
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Contact Artist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewArtist && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75" onClick={() => setPreviewArtist(null)} />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold text-gray-900">Artist Profile</div>
              <button
                onClick={() => setPreviewArtist(null)}
                className="px-3 py-1 rounded-lg border hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4">
                {previewArtist.imageUrl ? (
                  <img
                    src={previewArtist.imageUrl}
                    alt={previewArtist.imageAlt}
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    Artist
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xl font-bold text-gray-900 truncate">{previewArtist.name}</div>
                  {previewArtist.artForm ? <div className="text-sm text-red-600 mt-1">{previewArtist.artForm}</div> : null}
                </div>
              </div>

              {previewArtist.location ? (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span>{previewArtist.location}</span>
                </div>
              ) : null}

              <p className="mt-4 text-sm text-gray-700">
                {previewArtist.bio || 'No artist bio added yet.'}
              </p>

              {(previewArtist.social?.instagram || previewArtist.social?.facebook || previewArtist.social?.twitter || previewArtist.social?.linkedin || previewArtist.social?.website) ? (
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {previewArtist.social?.instagram ? <a href={previewArtist.social.instagram} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">Instagram</a> : null}
                  {previewArtist.social?.facebook ? <a href={previewArtist.social.facebook} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">Facebook</a> : null}
                  {previewArtist.social?.twitter ? <a href={previewArtist.social.twitter} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">Twitter</a> : null}
                  {previewArtist.social?.linkedin ? <a href={previewArtist.social.linkedin} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">LinkedIn</a> : null}
                  {previewArtist.social?.website ? <a href={previewArtist.social.website} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">Website</a> : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtStore;
