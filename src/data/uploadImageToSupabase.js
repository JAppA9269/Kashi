import { supabase } from './supabaseClient';

export async function uploadImages(files, username) {
  const uploadedUrls = [];

  for (const file of files) {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(`${username}/${fileName}`, file);

    if (error) {
      console.error('Upload error:', error.message);
    } else {
      const url = supabase.storage
        .from('product-images')
        .getPublicUrl(`${username}/${fileName}`).data.publicUrl;

      uploadedUrls.push(url);
    }
  }

  return uploadedUrls;
}
