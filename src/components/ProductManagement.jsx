import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, DollarSign, Image as ImageIcon, Save, X } from 'lucide-react';
import Navbar from './Navbar';

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Painting',
    inventory: 1,
    images: [],
    artistId: '',
    status: 'available'
  });

  const categories = ['Painting', 'Digital Art', 'Sculpture', 'Photography', 'Print', 'Supplies', 'Other'];

  useEffect(() => {
    // Load products from localStorage or API
    const savedProducts = localStorage.getItem('artProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    console.log('Editing product:', editingProduct);
    
    // Validation
    if (!formData.name || !formData.name.trim()) {
      alert('Product name is required');
      return;
    }
    
    if (!formData.price || formData.price <= 0) {
      alert('Valid price is required');
      return;
    }
    
    if (!formData.description || !formData.description.trim()) {
      alert('Product description is required');
      return;
    }
    
    console.log('Form validation passed');
    
    let updatedProducts;
    
    if (editingProduct) {
      // Update existing product
      console.log('Updating existing product:', editingProduct._id);
      updatedProducts = products.map(product =>
        product._id === editingProduct._id
          ? { ...formData, _id: editingProduct._id }
          : product
      );
      setProducts(updatedProducts);
    } else {
      // Add new product
      console.log('Adding new product');
      const newProduct = {
        ...formData,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      updatedProducts = [...products, newProduct];
      console.log('New product created:', newProduct);
      setProducts(updatedProducts);
    }

    console.log('Updated products list:', updatedProducts);

    // Save to localStorage
    localStorage.setItem('artProducts', JSON.stringify(updatedProducts));
    console.log('Products saved to localStorage');
    
    // Show success message
    if (editingProduct) {
      alert('Product updated successfully!');
    } else {
      alert('Product added successfully!');
    }

    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Painting',
      inventory: 1,
      images: [],
      artistId: '',
      status: 'available'
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || 'Painting',
      inventory: product.inventory || 1,
      images: product.images || [],
      artistId: product.artistId || '',
      status: product.status || 'available'
    });
    setShowAddForm(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(product => product._id !== productId);
      setProducts(updatedProducts);
      localStorage.setItem('artProducts', JSON.stringify(updatedProducts));
    }
  };

  const handleStatusToggle = (productId) => {
    const updatedProducts = products.map(product =>
      product._id === productId
        ? { ...product, status: product.status === 'available' ? 'sold' : 'available' }
        : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('artProducts', JSON.stringify(updatedProducts));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <button
              onClick={() => {
                console.log('Add Product button clicked');
                console.log('Current showAddForm state:', showAddForm);
                setShowAddForm(true);
                console.log('Set showAddForm to true');
              }}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
          
          <p className="text-gray-600">Manage artwork, pricing, and inventory</p>
          
          {/* Debug indicator */}
          <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
            Debug: showAddForm = {showAddForm.toString()}
            <button
              onClick={() => {
                console.log('Test toggle clicked');
                setShowAddForm(!showAddForm);
              }}
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
            >
              Toggle Form
            </button>
          </div>
        </div>

        {/* Add/Edit Product Form */}
        {(() => {
          console.log('Checking showAddForm for form display:', showAddForm);
          return showAddForm;
        })() && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="absolute inset-0" onClick={() => setShowAddForm(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inventory</label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="number"
                        name="inventory"
                        value={formData.inventory}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Describe your artwork..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <ImageIcon size={48} className="text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload images</span>
                    </label>
                  </div>
                </div>

                {/* Image Preview */}
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Image Preview</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = formData.images.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, images: newImages }));
                            }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Save size={20} className="mr-2" />
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon size={48} />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.status === 'sold' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {product.status === 'sold' ? 'Sold' : 'Available'}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-red-600">${product.price}</span>
                  <span className="text-sm text-gray-500">Stock: {product.inventory}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Package size={16} />
                  <span>{product.category}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleStatusToggle(product._id)}
                    className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                      product.status === 'sold'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  >
                    {product.status === 'sold' ? 'Mark Available' : 'Mark Sold'}
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
            <p className="text-gray-600">Start by adding your first artwork to the marketplace</p>
            <button
              onClick={() => {
                console.log('Empty state Add Product button clicked');
                console.log('Current showAddForm state:', showAddForm);
                setShowAddForm(true);
                console.log('Set showAddForm to true from empty state');
              }}
              className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
