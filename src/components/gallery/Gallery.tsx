
import ImageCard from './ImageCard';
import { type GalleryImage } from '../../lib/supabase';

interface GalleryProps {
  images: GalleryImage[];
}

export default function Gallery({ images }: GalleryProps) {
  // Split images into two columns for mobile
  const leftColumnImages = images.filter((_, i) => i % 2 === 0);
  const rightColumnImages = images.filter((_, i) => i % 2 === 1);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
      {/* Mobile: 2 columns, Desktop: 3 columns */}
      <div className="space-y-4 md:space-y-8">
        {leftColumnImages.map((image) => (
          <ImageCard key={image.id} {...image} />
        ))}
      </div>
      <div className="space-y-4 md:space-y-8">
        {rightColumnImages.map((image) => (
          <ImageCard key={image.id} {...image} />
        ))}
      </div>
      {/* Third column only visible on desktop */}
      <div className="hidden md:block space-y-8">
        {images.filter((_, i) => i % 3 === 2).map((image) => (
          <ImageCard key={image.id} {...image} />
        ))}
      </div>
    </div>
  );
}