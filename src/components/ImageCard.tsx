import React from 'react';
import { ExternalLink, Heart } from 'lucide-react';

interface ImageCardProps {
  src: string;
  alt: string;
  photographer: string;
  category: string;
}

export default function ImageCard({ src, alt, photographer, category }: ImageCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <div 
      className="relative overflow-hidden rounded-lg group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />
      <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="font-medium text-sm">{photographer}</p>
          <p className="text-xs text-gray-300">{category}</p>
          <div className="flex justify-between items-center mt-2">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Heart 
                size={20} 
                className={`transition-colors ${isLiked ? 'fill-red-500 stroke-red-500' : 'stroke-white'}`} 
              />
            </button>
            <a 
              href={src} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ExternalLink size={20} className="stroke-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}