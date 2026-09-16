import dictionary from '@/lib/data/word-library-extended.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'private, no-store',
      Vary: 'Authorization',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

async function hasPaidDictionaryAccess(authorization: string) {
  if (!supabaseUrl || !publishableKey) return false;
  const headers = {
    apikey: publishableKey,
    Authorization: authorization,
    'Content-Type': 'application/json',
  };
  const [guided, phrasebook] = await Promise.all([
    fetch(`${supabaseUrl}/rest/v1/rpc/has_guided_learning_access`, {
      method: 'POST',
      headers,
      body: '{}',
      cache: 'no-store',
    }),
    fetch(`${supabaseUrl}/rest/v1/rpc/has_phrasebook_pro_access`, {
      method: 'POST',
      headers,
      body: '{}',
      cache: 'no-store',
    }),
  ]);
  if (!guided.ok || !phrasebook.ok) return false;
  return (await guided.json()) === true || (await phrasebook.json()) === true;
}

export async function GET(request: Request) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer '))
    return json({ error: 'Authentication required' }, 401);

  try {
    if (!(await hasPaidDictionaryAccess(authorization)))
      return json({ error: 'Dictionary access required' }, 403);
    return json(dictionary);
  } catch {
    return json({ error: 'Dictionary service unavailable' }, 503);
  }
}
