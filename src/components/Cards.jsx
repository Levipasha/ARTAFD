import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Cards = () => {
  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Top Section - Modern Art Supply Store and NFT Launch Side by Side */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Modern Art Supply Store Card */}
          <div className="relative bg-[#0A0A0A] rounded-[24px] p-10 sm:p-12 lg:p-[60px] shadow-2xl hover:scale-[1.02] transition-transform duration-300 ease-out overflow-hidden">
            
            {/* Background Shopping Bag Icon */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[20%] opacity-[0.08] z-0">
              <ShoppingBag 
                size={280} 
                className="text-red-600 sm:w-64 sm:h-64 lg:w-80 lg:h-80"
              />
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
                  LIVE NOW
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
                <span className="mr-2">GO SHOPPING</span>
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
              <button className="w-full bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                REGISTER PROFILE
              </button>
              
              <div className="flex justify-center gap-4">
                <div className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-center min-w-[80px]">
                  <div className="text-xs font-bold text-black">?1000</div>
                  <div className="text-xs text-gray-600">LIFETIME</div>
                </div>
                <div className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-center min-w-[80px]">
                  <div className="text-xs font-bold text-black">0%</div>
                  <div className="text-xs text-gray-600">COMMS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card - Virtual Gallery */}
          <div className="relative bg-[#0A0A0A] p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden min-w-0">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-purple-900/20 pointer-events-none" />
            
            {/* Subtle Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3Cpath d='M20 20h20v20H20z'/%3E%3C/g%3E%3C/svg%3E")`
              }}
            />

            <div className="relative z-10">
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full tracking-wider uppercase">
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
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-200">
                  ENTER GALLERY
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cards;
