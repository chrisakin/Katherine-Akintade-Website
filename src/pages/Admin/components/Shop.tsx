import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, AlertCircle, Upload, X, Check } from 'lucide-react';
import { supabase, STORAGE_BUCKET } from '../../../lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image_url: string;
  active: boolean;
  created_at: string;
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const categories = [
  'Journal',
  'Course',
  'Ebook',
  'Template',
  'Preset',
  'Other'
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      if (!currentProduct.name || !currentProduct.price || !currentProduct.category) {
        setError('Name, price, and category are required');
        return;
      }

      let imageUrl = currentProduct.image_url;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const productData = {
        name: currentProduct.name,
        price: currentProduct.price,
        description: currentProduct.description,
        category: currentProduct.category,
        image_url: imageUrl,
        active: currentProduct.active ?? true
      };

      if (currentProduct.id) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', currentProduct.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
      }

      setIsEditing(false);
      setCurrentProduct({});
      setSelectedFile(null);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Products</h1>
          <button
            onClick={() => {
              setCurrentProduct({});
              setIsEditing(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg 
              hover:bg-gray-800 transition-colors"
          >
            <Plus size={20} />
            New Product
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-600">₦{product.price.toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs bg-gray-100`}>
                    {product.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    product.active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentProduct(product);
                        setIsEditing(true);
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {currentProduct.id ? 'Edit Product' : 'New Product'}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsEditing(false);
              setCurrentProduct({});
              setSelectedFile(null);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 
              rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X size={20} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white 
              rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            <Check size={20} />
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={currentProduct.name || ''}
              onChange={(e) => setCurrentProduct(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="Product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₦)
            </label>
            <input
              type="number"
              value={currentProduct.price || ''}
              onChange={(e) => setCurrentProduct(prev => ({ 
                ...prev, 
                price: parseInt(e.target.value) || 0 
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={currentProduct.category || ''}
              onChange={(e) => setCurrentProduct(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={currentProduct.description || ''}
              onChange={(e) => setCurrentProduct(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              rows={4}
              placeholder="Product description"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={currentProduct.active ?? true}
              onChange={(e) => setCurrentProduct(prev => ({ ...prev, active: e.target.checked }))}
              className="rounded border-gray-300 text-gray-900 focus:ring-gray-400"
            />
            <label htmlFor="active" className="text-sm text-gray-700">
              Product is active
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <div className="mt-2">
              {(selectedFile || currentProduct.image_url) && (
                <div className="mb-4">
                  <img
                    src={selectedFile ? URL.createObjectURL(selectedFile) : currentProduct.image_url}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="relative">
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept={ACCEPTED_IMAGE_TYPES.join(',')}
                  onChange={handleFileSelect}
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center gap-2 px-4 py-2 border-2 
                    border-dashed border-gray-300 rounded-lg hover:border-gray-400 
                    transition-colors cursor-pointer"
                >
                  <Upload size={20} />
                  <span>{selectedFile ? 'Change Image' : 'Upload Image'}</span>
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Accepted formats: JPEG, PNG, WebP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}