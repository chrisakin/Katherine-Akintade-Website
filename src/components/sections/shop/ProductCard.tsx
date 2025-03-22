import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from './types';
import CheckoutForm from './CheckoutForm';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
              <p className="text-gray-600">₦{product.price.toLocaleString()}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs bg-coral-light`}>
              {product.category}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <button 
            onClick={() => setShowCheckout(true)}
            className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      </div>

      {showCheckout && (
        <CheckoutForm 
          onClose={() => setShowCheckout(false)}
          product={product}
        />
      )}
    </>
  );
}