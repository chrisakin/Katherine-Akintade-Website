import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-client-info': 'supabase-js-v2'
    }
  }
});

// Storage bucket name
export const STORAGE_BUCKET = 'images';

export interface HeroImage {
  id: string;
  url: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  description: string;
  category: string;
  photographer: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  updated_at: string;
}

// Helper function to refresh the session
export const refreshSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  console.log('refreshed')
  if (error) {
    console.error('Error refreshing session:', error);
    return false;
  }
  
  if (!session) {
    return false;
  }

  const { error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) {
    console.error('Error refreshing token:', refreshError);
    return false;
  }

  return true;
};

// Error handler that attempts to refresh the session on RLS violations
export const handleSupabaseError = async (error: any) => {
  if (error?.message?.includes('row-level security') || error?.message?.includes('JWT')) {
    const refreshed = await refreshSession();
    return refreshed;
  }
  return false;
};