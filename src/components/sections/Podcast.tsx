import React from 'react';
import { Mic, Play, Clock } from 'lucide-react';

const episodes = [
  {
    title: "Creative Process & Inspiration",
    duration: "45:32",
    guest: "Emma Thompson",
    description: "Discussing the journey of finding inspiration and developing a unique creative voice."
  },
  {
    title: "Stories Behind the Lens",
    duration: "38:15",
    guest: "David Chen",
    description: "Exploring memorable moments and challenges in documentary photography."
  },
  {
    title: "Art in the Digital Age",
    duration: "42:18",
    guest: "Sarah Miller",
    description: "Navigating the intersection of traditional and digital artistic expression."
  }
];

export default function Podcast() {
  return (
    <section id="podcast" className="py-16 bg-mint-light">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Podcast</h2>
        <p className="text-gray-600 mb-12 max-w-2xl">
          Conversations with artists, creators, and innovators about their craft, 
          process, and vision.
        </p>
        <div className="space-y-6">
          {episodes.map((episode, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button className="p-3 bg-coral-light rounded-full hover:bg-coral transition-colors">
                    <Play size={20} className="text-gray-900" />
                  </button>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{episode.title}</h3>
                    <p className="text-gray-600">with {episode.guest}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock size={16} />
                  <span>{episode.duration}</span>
                </div>
              </div>
              <p className="text-gray-600">{episode.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}