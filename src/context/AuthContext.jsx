'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // If Supabase is not configured, skip auth
    if (!supabase) {
      // Use a microtask to avoid synchronous setState in effect
      queueMicrotask(() => setLoading(false));
      return;
    }

    // Get initial session
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signUp = async (email, password, username) => {
    if (!supabase) throw new Error('Supabase is not configured');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Send people back to whichever deployment they signed up on.
        emailRedirectTo: window.location.origin,
        data: {
          username,
        },
      },
    });

    if (error) throw error;

    // The profile row is created by the on_auth_user_created trigger (supabase/schema.sql).
    return data;
  };

  const signIn = async (email, password) => {
    if (!supabase) throw new Error('Supabase is not configured');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    if (!supabase) return;
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    supabase,
    isConfigured: !!supabase,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
