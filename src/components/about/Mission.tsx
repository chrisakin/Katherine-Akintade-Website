import React from 'react';
import { Camera, Heart, Brain } from 'lucide-react';

const pillars = [
  {
    icon: Camera,
    title: "Creative Expression",
    description: "Learn photography as a medium for authentic self-expression and storytelling."
  },
  {
    icon: Brain,
    title: "Mindset Development",
    description: "Develop confidence, resilience, and a growth mindset through creative practice."
  },
  {
    icon: Heart,
    title: "Community Building",
    description: "Connect with like-minded peers and create a supportive creative community."
  }
];

export default function Mission() {
  return (
    <section className="mb-20">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
      <p className="text-gray-700 mb-12 max-w-2xl">
        We believe in the transformative power of photography to help teenagers develop 
        self-awareness, confidence, and a strong sense of identity during their formative years.
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        {pillars.map((pillar, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="mb-4">
              <pillar.icon size={32} className="text-gray-900" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">{pillar.title}</h3>
            <p className="text-gray-600">{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}