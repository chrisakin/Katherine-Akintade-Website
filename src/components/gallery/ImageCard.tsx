import React from 'react';
import { ExternalLink, Heart } from 'lucide-react';
import { type GalleryImage } from '../../lib/supabase';

export default function ImageCard({ url, description, photographer, category }: GalleryImage) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <div 
      className="relative overflow-hidden rounded-2xl group shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={url}
        alt={description}
        className="w-full h-[400px] md:h-[600px] object-cover transition-transform duration-700 
        ease-out group-hover:scale-105 group-hover:rotate-1"
        loading="lazy"
      />
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent 
          transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white transform transition-transform duration-500">
          <p className="font-medium text-lg md:text-2xl mb-3">{description}</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm md:text-base text-gray-200">{photographer}</p>
              <p className="text-xs md:text-sm text-coral mt-1">{category}</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Heart 
                  size={24} 
                  className={`transition-all ${isLiked ? 'fill-coral stroke-coral scale-110' : 'stroke-white'}`} 
                />
              </button>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ExternalLink size={24} className="stroke-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}