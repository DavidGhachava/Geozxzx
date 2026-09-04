import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const allowedOrigins = new Set([
  'https://geo-learn-georgian.heromak2008.chatgpt.site',
  'https://geoproduction.netlify.app',
  'http://localhost:3000',
]);

Deno.serve(async (request) => {
  const origin = request.headers.get('origin') ?? '';
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.has(origin)
      ? origin
      : 'https://geo-learn-georgian.heromak2008.chatgpt.site',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
  if (request.method === 'OPTIONS')
    return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST')
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    });

  const authorization = request.headers.get('Authorization');
  if (!authorization)
    return new Response('Authentication required', {
      status: 401,
      headers: corsHeaders,
    });

  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !anonKey || !serviceRoleKey)
    return new Response('Server configuration error', {
      status: 500,
      headers: corsHeaders,
    });

  const authClient = createClient(url, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const {
    data: { user },
    error: userError,
  } = await authClient.auth.getUser();
  if (userError || !user)
    return new Response('Invalid session', {
      status: 401,
      headers: corsHeaders,
    });

  const adminClient = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(
    user.id,
  );
  if (deleteError)
    return Response.json(
      { error: 'Account deletion failed' },
      { status: 500, headers: corsHeaders },
    );

  return Response.json({ deleted: true }, { headers: corsHeaders });
});
