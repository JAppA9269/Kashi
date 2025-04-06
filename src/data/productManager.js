import { supabase } from './supabaseClient';

export async function getAllProducts() {
  const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data;
}

export async function addProduct(product) {
  const { data, error } = await supabase.from('products').insert([product]);
  if (error) {
    console.error('Error adding product:', error);
    throw error;
  }
  return data;
}
