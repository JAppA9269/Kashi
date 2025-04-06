import { supabase } from './supabaseClient';

export async function uploadAvatar(file, userId) {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

  // 🧼 Bust browser cache
  return `${data.publicUrl}?t=${Date.now()}`;
}
