import { supabase } from './supabaseClient';

export async function signUp(email, password) {
  return await supabase.auth.signUp({ email, password }); // ✅ Just return result
}

export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return await supabase.auth.signOut();
}
