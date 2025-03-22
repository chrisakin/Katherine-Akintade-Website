import  { useEffect, useState } from 'react';
import { supabase, type GalleryImage } from '../lib/supabase';
import Gallery from '../components/gallery/Gallery';

export default function Photography() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setImages(data);
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <main className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/4 mb-12"></div>
            <div className="grid gap-8 md:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Photography</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            A collection of moments captured through my lens. Each image tells a story of growth, 
            confidence, and self-discovery.
          </p>
        </div>
        <Gallery images={images} />
      </div>
    </main>
  );
}