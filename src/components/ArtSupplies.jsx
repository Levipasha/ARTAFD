import React, { useEffect } from 'react';

const ArtSupplies = () => {
  useEffect(() => {
    document.title = 'Art Supplies - ARTISTRY';
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Discover premium art supplies and materials for artists across India. Quality paints, brushes, canvases, and more.';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const supplies = [
    {
      category: 'Painting Supplies',
      items: [
        { name: 'Acrylic Paints', description: 'Vibrant, quick-drying paints perfect for all skill levels', price: 'Starting from ?299' },
        { name: 'Oil Paints', description: 'Professional grade oil paints with rich pigmentation', price: 'Starting from ?499' },
        { name: 'Watercolors', description: 'Premium watercolor sets for artists and students', price: 'Starting from ?199' },
        { name: 'Paint Brushes', description: 'High-quality brushes for various painting techniques', price: 'Starting from ?149' }
      ]
    },
    {
      category: 'Drawing Materials',
      items: [
        { name: 'Graphite Pencils', description: 'Professional drawing pencils in various grades', price: 'Starting from ?99' },
        { name: 'Charcoal Sets', description: 'Professional charcoal for dramatic drawings', price: 'Starting from ?199' },
        { name: 'Sketchbooks', description: 'Premium paper sketchbooks for all media', price: 'Starting from ?249' },
        { name: 'Inking Pens', description: 'Fine liner pens for detailed illustrations', price: 'Starting from ?149' }
      ]
    },
    {
      category: 'Canvas & Surfaces',
      items: [
        { name: 'Stretched Canvas', description: 'Pre-stretched canvases in various sizes', price: 'Starting from ?399' },
        { name: 'Canvas Boards', description: 'Rigid canvas boards for stable painting surface', price: 'Starting from ?299' },
        { name: 'Watercolor Paper', description: 'Professional watercolor paper pads', price: 'Starting from ?349' },
        { name: 'Drawing Paper', description: 'High-quality drawing paper for all media', price: 'Starting from ?199' }
      ]
    },
    {
      category: 'Sculpting & 3D',
      items: [
        { name: 'Clay Sets', description: 'Professional modeling clay for sculptors', price: 'Starting from ?499' },
        { name: 'Sculpting Tools', description: 'Complete tool sets for clay sculpting', price: 'Starting from ?799' },
        { name: 'Stone Carving Tools', description: 'Professional tools for stone sculpting', price: 'Starting from ?1,299' },
        { name: 'Wood Carving Sets', description: 'Quality tools for wood carving projects', price: 'Starting from ?999' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Art Supplies</h1>
          <p className="text-xl md:text-2xl mb-8">Premium quality art materials for every artist's journey</p>
          <p className="text-lg max-w-3xl mx-auto">Discover a comprehensive range of art supplies carefully selected to meet the needs of beginners, students, and professional artists across India.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Featured Products */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-red-400 mb-8 text-center">Featured Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supplies.map((category, index) => (
              <div key={index} className="bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-xl p-6 hover:bg-opacity-90 transition-all duration-300">
                <h3 className="text-xl font-semibold text-red-400 mb-4">{category.category}</h3>
                <p className="text-gray-400 mb-4">Professional-grade supplies for {category.category.toLowerCase()}</p>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Explore {category.category.split(' ')[0]}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Products */}
        <section>
          <h2 className="text-3xl font-bold text-red-400 mb-8 text-center">Complete Product Range</h2>
          <div className="space-y-8">
            {supplies.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-xl p-8">
                <h3 className="text-2xl font-bold text-red-400 mb-6">{category.category}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                      <h4 className="text-lg font-semibold text-white mb-2">{item.name}</h4>
                      <p className="text-gray-400 mb-3">{item.description}</p>
                      <p className="text-red-400 font-semibold">{item.price}</p>
                      <button className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Special Offers */}
        <section className="mt-12 bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4 text-center">Special Offers for Members</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">15% Member Discount</h3>
              <p>Exclusive discount on all art supplies for lifetime members</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p>Free delivery on orders above ?999 across India</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Bulk Orders</h3>
              <p>Special pricing for art schools and institutions</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ArtSupplies;
