const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

const jsonHeaders = {
  'Cache-Control': 'private, no-store',
  Vary: 'Authorization',
  'X-Content-Type-Options': 'nosniff',
};

export function privateJson(body: unknown, status = 200) {
  return Response.json(body, { status, headers: jsonHeaders });
}

async function callBooleanRpc(name: string, authorization: string) {
  if (!supabaseUrl || !publishableKey) return false;
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: publishableKey,
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: '{}',
    cache: 'no-store',
  });
  if (!response.ok) return false;
  return (await response.json()) === true;
}

export async function hasGuidedLearningAccess(authorization: string) {
  return callBooleanRpc('has_guided_learning_access', authorization);
}

export async function hasPaidDictionaryAccess(authorization: string) {
  const [guided, phrasebook] = await Promise.all([
    callBooleanRpc('has_guided_learning_access', authorization),
    callBooleanRpc('has_phrasebook_pro_access', authorization),
  ]);
  return guided || phrasebook;
}
