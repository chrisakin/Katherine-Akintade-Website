import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { supabase, type HeroImage } from '../../lib/supabase';

export default function Hero() {
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);

  useEffect(() => {
    const fetchHeroImage = async () => {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .eq('active', true)
        .single();

      if (!error && data) {
        setHeroImage(data);
      }
    };

    fetchHeroImage();
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            heroImage?.url || 
            'https://raw.githubusercontent.com/stackblitz/stackblitz-codeflow/main/assets/katherine-10.jpg'
          })`
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative text-center text-white px-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Camera size={40} className="text-coral animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Katherine Ayobola Akintade
        </h1>
        <p className="text-lg md:text-xl text-gray-200 font-light">
          Identity Shaper • Creative Entrepreneur • Photographer • Loved by God
        </p>
        <div className="mt-12">
          <a 
            href="#photography" 
            className="inline-block px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md 
            border border-white/30 rounded-full text-white transition-all 
            hover:scale-105 hover:shadow-xl"
          >
            Explore My Work
          </a>
        </div>
      </div>
    </section>
  );
}