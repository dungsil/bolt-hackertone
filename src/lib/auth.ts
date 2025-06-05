import { createClient } from '@supabase/supabase-js';
import { supabase } from './db';

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // After successful authentication, ensure user exists in the users table
    if (data.user) {
      const { data: existingUser } = await supabase
        .from('users')
        .select()
        .eq('id', data.user.id)
        .maybeSingle(); // Changed from single() to maybeSingle()

      if (!existingUser) {
        // If user doesn't exist in users table, create them
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: email.split('@')[0], // Use part before @ as temporary name
          });

        if (profileError) throw profileError;
      }
    }

    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signUp(email: string, password: string, name: string) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          name,
        });

      if (profileError) throw profileError;
    }

    return authData;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;

    if (user) {
      // Get the user's profile data
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      return profile || user; // Return profile if exists, otherwise return auth user
    }

    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
}