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
  if (!supabaseUrl || !publishableKey) {
    console.error(
      'Paid content access check is missing Supabase configuration',
    );
    throw new Error('Supabase server configuration is unavailable');
  }
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
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    console.error('Paid content access check failed', {
      rpc: name,
      status: response.status,
      detail,
    });
    throw new Error(`Supabase access check failed with ${response.status}`);
  }
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
