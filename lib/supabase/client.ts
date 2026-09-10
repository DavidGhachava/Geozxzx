import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

function normalizeSupabaseUrl(value: string | undefined) {
  const candidate = value?.trim();
  if (!candidate) return null;

  try {
    const parsed = new URL(candidate);
    const dashboardProject = parsed.pathname.match(
      /^\/dashboard\/project\/([a-z0-9-]+)/i,
    );

    // A copied Dashboard URL is a common deployment mistake. The browser must
    // call the project's API origin instead of supabase.com/dashboard/….
    if (parsed.hostname === 'supabase.com' && dashboardProject)
      return `https://${dashboardProject[1]}.supabase.co`;

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:')
      return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);

export function createClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}
