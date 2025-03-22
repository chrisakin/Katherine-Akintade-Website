import { supabase } from '../../../lib/supabase';
import { Product } from './types';

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data.map(product => ({
    name: product.name,
    price: product.price,
    description: product.description,
    category: product.category,
    image: product.image_url
  }));
};