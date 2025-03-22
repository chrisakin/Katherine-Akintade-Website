import React, { useState, useEffect } from 'react';
import { Upload, Trash2, AlertCircle } from 'lucide-react';
import { supabase, STORAGE_BUCKET, type HeroImage, type GalleryImage } from '../../../lib/supabase';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface ImageUploadState {
  file: File | null;
  description?: string;
  category?: string;
  photographer?: string;
}

export default function Photos() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadState, setUploadState] = useState<ImageUploadState>({
    file: null,
    description: '',
    category: '',
    photographer: ''
  });
  const [uploadType, setUploadType] = useState<'hero' | 'gallery'>('hero');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      // Fetch hero images
      const { data: heroData, error: heroError } = await supabase
        .from('hero_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (heroError) throw heroError;
      setHeroImages(heroData || []);

      // Fetch gallery images
      const { data: galleryData, error: galleryError } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (galleryError) throw galleryError;
      setGalleryImages(galleryData || []);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images. Please check your Supabase connection.');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    setUploadState(prev => ({ ...prev, file }));
    setError('');
  };

  const handleUpload = async () => {
    if (!uploadState.file) return;

    try {
      setUploading(true);
      setError('');

      // Create a unique file path
      const fileExt = uploadState.file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${uploadType}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, uploadState.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      // Save to database
      if (uploadType === 'hero') {
        const { error: dbError } = await supabase
          .from('hero_images')
          .insert([{
            url: publicUrl,
            active: false
          }]);

        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase
          .from('gallery_images')
          .insert([{
            url: publicUrl,
            description: uploadState.description,
            category: uploadState.category,
            photographer: uploadState.photographer
          }]);

        if (dbError) throw dbError;
      }

      // Reset form and refresh images
      setUploadState({
        file: null,
        description: '',
        category: '',
        photographer: ''
      });
      fetchImages();
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, type: 'hero' | 'gallery') => {
    try {
      // First, get the image URL to extract the file path
      const { data: image, error: fetchError } = await supabase
        .from(type === 'hero' ? 'hero_images' : 'gallery_images')
        .select('url')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Extract file path from URL
      const url = new URL(image.url);
      const filePath = url.pathname.split('/').pop();

      if (filePath) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([`${type}/${filePath}`]);

        if (storageError) throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from(type === 'hero' ? 'hero_images' : 'gallery_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;
      fetchImages();
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    }
  };

  const toggleHeroActive = async (id: string) => {
    try {
      // Deactivate all hero images
      await supabase
        .from('hero_images')
        .update({ active: false })
        .eq('active', true);

      // Activate the selected image
      const { error } = await supabase
        .from('hero_images')
        .update({ active: true })
        .eq('id', id);

      if (error) throw error;
      fetchImages();
    } catch (err) {
      console.error('Error updating hero image:', err);
      setError('Failed to update hero image');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Image Manager</h1>
        
        <div className="flex items-center gap-4">
          <select
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value as 'hero' | 'gallery')}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none 
              focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          >
            <option value="hero">Hero Image</option>
            <option value="gallery">Gallery Image</option>
          </select>

          <div className="relative">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              onChange={handleFileSelect}
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className={`
                inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg
                hover:bg-gray-800 transition-colors cursor-pointer
                ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <Upload size={20} />
              {uploading ? 'Uploading...' : 'Select Image'}
            </label>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {uploadState.file && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Upload Details</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={URL.createObjectURL(uploadState.file)}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <p className="font-medium">{uploadState.file.name}</p>
                <p className="text-sm text-gray-600">
                  {(uploadState.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {uploadType === 'gallery' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Photographer"
                  value={uploadState.photographer}
                  onChange={(e) => setUploadState(prev => ({ ...prev, photographer: e.target.value }))}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none 
                    focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={uploadState.category}
                  onChange={(e) => setUploadState(prev => ({ ...prev, category: e.target.value }))}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none 
                    focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={uploadState.description}
                  onChange={(e) => setUploadState(prev => ({ ...prev, description: e.target.value }))}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none 
                    focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setUploadState({ file: null })}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || (uploadType === 'gallery' && 
                  (!uploadState.photographer || !uploadState.category || !uploadState.description))}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 
                  transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Images Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Hero Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroImages.map((image) => (
            <div 
              key={image.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={image.url}
                alt="Hero"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex justify-between items-center">
                <button
                  onClick={() => toggleHeroActive(image.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    image.active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {image.active ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => handleDelete(image.id, 'hero')}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Images Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Gallery Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <div 
              key={image.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={image.url}
                alt={image.description}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="font-medium">{image.photographer}</h3>
                  <p className="text-sm text-gray-600">{image.category}</p>
                  <p className="text-sm text-gray-600 mt-2">{image.description}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(image.id, 'gallery')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}