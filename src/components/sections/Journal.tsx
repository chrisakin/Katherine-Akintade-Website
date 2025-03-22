import React from 'react';
import { Calendar } from 'lucide-react';

const journals = [
  {
    title: "On My Self-Worth",
    date: "March 20, 2024",
    excerpt: "Body positivity, self-image, self-esteem, and identity are interconnected concepts that affect how we perceive ourselves. Let's explore the journey of self-discovery and worth through God's eyes.",
    category: "Identity",
    content: `I was struck by a conversation where someone told a young woman she was 'shapeless.' I was taken aback, thinking, 'How could you say that? She's beautifully shaped!' Unfortunately, body shaming comments like this are all too common. Yet, the young woman replied with confidence, 'I am precious and honored in my creator's sight.' What a powerful declaration of self-worth!...`
  },
  {
    title: "The Art of Slow Living",
    date: "March 15, 2024",
    excerpt: "Exploring the beauty of taking life at a slower pace and finding meaning in small moments.",
    category: "Lifestyle"
  },
  {
    title: "Light and Shadow: A Photographer's Perspective",
    date: "March 10, 2024",
    excerpt: "Reflecting on how natural light shapes our perception and creates visual stories.",
    category: "Photography"
  }
];

export default function Journal() {
  return (
    <section id="journal" className="py-16 bg-mint-light">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Journal</h2>
        <p className="text-gray-600 mb-12 max-w-2xl">
          Personal reflections, creative processes, and stories behind the lens.
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {journals.map((entry, index) => (
            <article 
              key={index}
              className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${
                index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <Calendar size={16} />
                <span>{entry.date}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  entry.category === 'Identity' ? 'bg-coral-light' :
                  entry.category === 'Photography' ? 'bg-sky-light' : 'bg-mint'
                }`}>
                  {entry.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{entry.title}</h3>
              <p className="text-gray-600">{entry.excerpt}</p>
              <button className="mt-4 text-sm text-gray-900 hover:text-coral transition-colors">
                Read More →
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}