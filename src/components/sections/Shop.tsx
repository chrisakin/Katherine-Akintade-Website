import React, { useEffect, useState } from 'react';
import ProductCard from './shop/ProductCard';
import { getProducts } from './shop/shop-data';
import { Product } from './shop/types';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section id="shop" className="py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/4 mb-12"></div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-gray-100 h-96 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="shop" className="py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Shop</h2>
          <p className="text-gray-600 mb-12">
            No products available at the moment. Check back soon!
          </p>
        </div>
      </section>
    );
  }

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