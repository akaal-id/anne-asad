
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Missing Supabase environment variables. Please check your .env.local file and restart the server.');
}

// Fallback to avoid crash on module load if vars are missing
const url = supabaseUrl || 'https://gjkkaokgpuzkpeqlunca.supabase.co';
const key = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqa2thb2tncHV6a3BlcWx1bmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MjA1MjgsImV4cCI6MjA4NDI5NjUyOH0.khAHDBcEyGlGbcQE9RNnbLmjr5WmXeYv9v1tT8qC_0E';

export const supabase = createClient(url, key);
