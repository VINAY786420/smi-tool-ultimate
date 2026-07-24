import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env. ' +
      'Get the service_role key from Supabase Dashboard -> Settings -> API.'
  );
}

// Server-side only client. Uses the service role key so it can bypass RLS
// where needed and write freely. NEVER expose this key to the frontend.
export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
