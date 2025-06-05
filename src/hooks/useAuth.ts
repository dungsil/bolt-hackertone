import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/db';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const ensureUserProfile = async (authUser: User) => {
    try {
      // Check if user profile exists using maybeSingle() instead of single()
      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('id', authUser.id)
        .maybeSingle();

      // If profile doesn't exist, create it
      if (!profile) {
        await supabase.from('users').upsert({
          id: authUser.id,
          email: authUser.email,
          name: authUser.email?.split('@')[0] || 'User', // Default name from email
        }, {
          onConflict: 'id',
          ignoreDuplicates: true
        });
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  };

  const handleAuthChange = async (authUser: User | null) => {
    if (authUser) {
      await ensureUserProfile(authUser);
    }
    setUser(authUser);
    setIsLoading(false);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
  };
}