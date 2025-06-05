import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import * as schema from './schema';

// Create Supabase client
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Create Postgres client
const connectionString = import.meta.env.VITE_SUPABASE_DB_URL;
const client = postgres(connectionString);

// Create Drizzle client
export const db = drizzle(client, { schema });