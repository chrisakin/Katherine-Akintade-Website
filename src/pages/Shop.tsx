import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/sections/shop/ProductCard';
import { Product } from '../components/sections/shop/types';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProducts(data.map(product => ({
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image_url
        })));
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <main className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/4 mb-12"></div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Shop</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Discover resources and tools to support your creative journey and personal growth.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center text-gray-600">
            No products available at the moment. Check back soon!
          </div>
        )}
      </div>
    </main>
  );
}