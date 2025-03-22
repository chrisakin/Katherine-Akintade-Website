import React from 'react';
import BlogCard from './blog/BlogCard';
import { blogPosts } from './blog/blog-data';

export default function Blog() {
  return (
    <section id="blog" className="py-24 bg-mint-light/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Blog</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Personal reflections, creative insights, and stories that inspire. Join me on this journey 
            of self-discovery and artistic exploration.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <BlogCard key={index} post={post} featured={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}