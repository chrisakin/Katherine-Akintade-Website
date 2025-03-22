import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Photography helped me see myself differently. I learned to appreciate my unique perspective and gained so much confidence.",
    author: "Sarah, 16",
    program: "Photography Workshop"
  },
  {
    quote: "The mentoring sessions changed how I think about challenges. I now see them as opportunities to grow and learn.",
    author: "Michael, 15",
    program: "Mindset Mentoring"
  },
  {
    quote: "Being part of the Creative Club has given me a community where I can truly be myself and express my creativity.",
    author: "Emma, 17",
    program: "Teen Creative Club"
  }
];

export default function Testimonials() {
  return (
    <section className="mb-20">
      <h2 className="text-3xl font-bold mb-12 text-gray-900">Student Voices</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-gray-50 p-6 rounded-lg relative">
            <Quote className="absolute top-4 right-4 text-gray-300" size={24} />
            <p className="text-gray-700 mb-6 italic">{testimonial.quote}</p>
            <div>
              <p className="font-semibold text-gray-900">{testimonial.author}</p>
              <p className="text-sm text-gray-600">{testimonial.program}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}