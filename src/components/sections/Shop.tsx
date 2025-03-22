import React from 'react';
import ProductCard from './shop/ProductCard';
import { products } from './shop/shop-data';

export default function Shop() {
  return (
    <section id="shop" className="py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Shop</h2>
        <p className="text-gray-600 mb-12 max-w-2xl">
          Discover resources and tools to support your creative journey and personal growth.
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}