import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { speakingUnit } from '../lib/speaking-unit.ts';

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

const apiKey = env.ELEVENLABS_API_KEY;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!apiKey) throw new Error('ELEVENLABS_API_KEY is missing from .env.local');
if (!supabaseKey)
  throw new Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing');

const projectRef = 'qwddgolzffskytfteqhw';
const phraseResponse = await fetch(
  `https://${projectRef}.supabase.co/rest/v1/phrases?select=georgian,category_slug,sort_order&is_free=eq.true&order=category_slug.asc,sort_order.asc`,
  { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } },
);
if (!phraseResponse.ok)
  throw new Error(`Phrase fetch failed with ${phraseResponse.status}`);

const freePhrases = await phraseResponse.json();
const missionPhrases = speakingUnit.flatMap((step) =>
  (step.scenarios ?? []).map((scenario) =>
    scenario.options[scenario.correct].replace(/[.!?]+$/u, '').trim(),
  ),
);
const texts = [
  ...freePhrases.map((phrase) => phrase.georgian),
  ...missionPhrases,
].filter((text, index, all) => text && all.indexOf(text) === index);

const outputDirectory = path.join(root, 'public', 'audio', 'phrases');
const manifestPath = path.join(root, 'lib', 'phrase-audio-manifest.json');
await mkdir(outputDirectory, { recursive: true });

const voiceId = 'JBFqnCBsd6RMkjVDRZzb';
const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fileIsReady(filePath) {
  try {
    return (await stat(filePath)).size > 512;
  } catch {
    return false;
  }
}

async function generate(text, filePath) {
  if (await fileIsReady(filePath)) return 'cached';
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_v3',
          language_code: 'ka',
        }),
      },
    );
    if (response.ok) {
      await writeFile(filePath, Buffer.from(await response.arrayBuffer()));
      return 'generated';
    }
    const message = await response.text();
    if (attempt === 4)
      throw new Error(
        `Audio generation failed (${response.status}) for ${text}: ${message}`,
      );
    await sleep(750 * attempt);
  }
}

const entries = texts.map((ka, index) => ({
  ka,
  audio: `/audio/phrases/phrase-${String(index + 1).padStart(3, '0')}.mp3`,
}));

let generated = 0;
for (let index = 0; index < entries.length; index += 2) {
  const batch = entries.slice(index, index + 2);
  const results = await Promise.all(
    batch.map(async (entry) => {
      const filePath = path.join(root, 'public', entry.audio);
      return generate(entry.ka, filePath);
    }),
  );
  generated += results.filter((result) => result === 'generated').length;
  console.log(`Audio ${Math.min(index + 2, entries.length)}/${entries.length}`);
}

await writeFile(manifestPath, `${JSON.stringify(entries, null, 2)}\n`);
console.log(
  JSON.stringify({
    total: entries.length,
    generated,
    cached: entries.length - generated,
  }),
);
