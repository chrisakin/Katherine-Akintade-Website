import React from 'react';
import { Camera, Pencil, Mic } from 'lucide-react';
import ServiceCard from './ServiceCard';

const services = [
  {
    icon: Camera,
    title: "Photography",
    description: "Specializing in portrait and street photography, I capture authentic moments that tell compelling stories."
  },
  {
    icon: Pencil,
    title: "Writing",
    description: "Through my journal, I share insights about creative processes, travel experiences, and personal reflections."
  },
  {
    icon: Mic,
    title: "Podcasting",
    description: "Hosting conversations with fellow creators about their craft, inspiration, and creative journey."
  }
];

export default function Services() {
  return (
    <>
      <h2 className="text-3xl font-bold mb-8">What I Do</h2>
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </>
  );
}