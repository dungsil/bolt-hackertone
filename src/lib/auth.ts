import { createClient } from '@supabase/supabase-js';
import { supabase } from './db';

export async function signIn(email: string, password: string) {
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
      .single();

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
}

export async function signUp(email: string, password: string, name: string) {
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
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}