import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  profile: Profile | null;
  login: (emailOrUsername: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) { // Accept children
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // Check active sessions and set user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for changes in auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(event);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
    }
  };

  const login = async (emailOrUsername: string, password: string) => {
    let email = emailOrUsername;

    // If input is username, get the email from profiles
    if (!emailOrUsername.includes('@')) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', emailOrUsername)
        .single();

      if (!profileData) {
        return { error: 'Invalid credentials' };
      }

      const { data: userData } = await supabase
        .from('auth.users')
        .select('email')
        .eq('id', profileData.id)
        .single();

      if (!userData) {
        return { error: 'Invalid credentials' };
      }

      email = userData.email;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    setProfile(null);
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    return { error };
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        profile,
        login, 
        logout,
        updatePassword 
      }}
    >
      {children} {/* Ensure children are rendered */}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}