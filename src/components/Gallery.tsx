
import ImageCard from './ImageCard';

const images = [
  {
    src: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
    alt: "Misty mountains at sunset",
    photographer: "James Wilson",
    category: "Landscape"
  },
  {
    src: "https://images.unsplash.com/photo-1682687221038-404670f09727",
    alt: "Urban architecture",
    photographer: "Sarah Chen",
    category: "Architecture"
  },
  {
    src: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538",
    alt: "Portrait in natural light",
    photographer: "Michael Brown",
    category: "Portrait"
  },
  {
    src: "https://images.unsplash.com/photo-1682687220199-d0124f48f95b",
    alt: "Street photography",
    photographer: "Elena Rodriguez",
    category: "Street"
  },
  {
    src: "https://images.unsplash.com/photo-1682687221080-5cb261c645cb",
    alt: "Wildlife shot",
    photographer: "David Kim",
    category: "Wildlife"
  },
  {
    src: "https://images.unsplash.com/photo-1682687220067-dced0c5bf699",
    alt: "Abstract patterns",
    photographer: "Lisa Taylor",
    category: "Abstract"
  }
];

export default function Gallery() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {images.map((image, index) => (
        <div key={index} className={`${
          index % 3 === 0 ? 'row-span-2' : ''
        }`}>
          <ImageCard {...image} />
        </div>
      ))}
    </div>
  );
}