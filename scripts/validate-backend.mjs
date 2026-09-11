import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const envText = await readFile(path.join(root, '.env.local'), 'utf8');
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*([^#=]+)=(.*)$/))
    .filter(Boolean)
    .map((match) => [
      match[1].trim(),
      match[2].trim().replace(/^['"]|['"]$/g, ''),
    ]),
);

const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const apiKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!baseUrl || !apiKey)
  throw new Error('Supabase URL or publishable key is missing from .env.local');

const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}` };
const checks = [];

async function check(name, pathName, options = {}) {
  const response = await fetch(`${baseUrl}${pathName}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });
  const body = await response.text();
  checks.push({ name, status: response.status, ok: response.ok, body });
}

await check('auth health', '/auth/v1/health');
await check(
  'free phrase catalog',
  '/rest/v1/phrases?select=id&is_free=eq.true',
  {
    headers: { Prefer: 'count=exact', Range: '0-0' },
  },
);
await check('word memory RLS', '/rest/v1/word_memory?select=word_id&limit=1');
await check(
  'learning progress RLS',
  '/rest/v1/learning_path_progress?select=step_number&limit=1',
);
await check(
  'learner preferences RLS',
  '/rest/v1/learner_preferences?select=primary_goal&limit=1',
);
await check('guided access RPC', '/rest/v1/rpc/has_guided_learning_access', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: '{}',
});
await check('phrasebook access RPC', '/rest/v1/rpc/has_phrasebook_pro_access', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: '{}',
});
await check('account deletion CORS', '/functions/v1/delete-account', {
  method: 'OPTIONS',
  headers: {
    Origin: 'https://geoproduction.netlify.app',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'authorization',
  },
});

const failures = [];
const protectedChecks = [
  'word memory RLS',
  'learning progress RLS',
  'learner preferences RLS',
];
for (const result of checks) {
  const protectedAndDenied =
    protectedChecks.includes(result.name) && result.status === 401;
  const protectedAndEmpty =
    protectedChecks.includes(result.name) && result.ok && result.body === '[]';
  if (!result.ok && !protectedAndDenied)
    failures.push(`${result.name}: HTTP ${result.status}`);
  if (
    protectedChecks.includes(result.name) &&
    !protectedAndDenied &&
    !protectedAndEmpty
  )
    failures.push(`${result.name}: anonymous access was not safely blocked`);
  if (
    ['guided access RPC', 'phrasebook access RPC'].includes(result.name) &&
    result.body !== 'false'
  )
    failures.push(`${result.name}: anonymous access was not denied`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    JSON.stringify(
      Object.fromEntries(checks.map((result) => [result.name, result.status])),
    ),
  );
}
