import React, { useEffect, useState } from 'react';
import Gallery from '../gallery/Gallery';
import { supabase, type GalleryImage } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Photography() {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setImages(data);
      }
    };

    fetchImages();
  }, []);

  return (
    <section id="photography" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Photography</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Empowering and inspiring teenagers on their journey to adulthood through the lens of 
            photography. Each image captures not just a moment, but a story of growth, confidence, 
            and self-discovery.
          </p>
        </div>
        <Gallery images={images} />
        <div className="text-center mt-12">
          <Link 
            to="/photography"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg 
              hover:bg-gray-800 transition-colors"
          >
            View All Photos
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}