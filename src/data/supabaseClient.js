import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nzthnriqvittddmrglze.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56dGhucmlxdml0dGRkbXJnbHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1Nzk1MTksImV4cCI6MjA1OTE1NTUxOX0.5QM_qpQhn1TOsthLeEfcZfUl5Ua0zBByReO3aYd5T9Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
