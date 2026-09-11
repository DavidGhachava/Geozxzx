import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import { speakingUnit } from '../lib/speaking-unit.ts';
import { wordLibrary } from '../lib/word-library.ts';

const root = path.resolve(import.meta.dirname, '..');
const wordAudioIds = new Set(
  JSON.parse(
    await readFile(path.join(root, 'lib/word-audio-manifest.json'), 'utf8'),
  ),
);
const phraseAudioManifest = JSON.parse(
  await readFile(path.join(root, 'lib/phrase-audio-manifest.json'), 'utf8'),
);
const phraseAudio = new Map(
  phraseAudioManifest.map((entry) => [
    entry.ka.trim().replace(/[.!?…]+$/u, ''),
    entry.audio,
  ]),
);
const wordsByGeorgian = new Map(wordLibrary.map((word) => [word.ka, word]));
const failures = [];

const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

expect(speakingUnit.length === 48, 'The guided course must contain 48 steps.');
expect(
  speakingUnit.every((step, index) => step.number === index + 1),
  'Course step numbers must be consecutive.',
);

for (const step of speakingUnit) {
  expect(
    step.unit >= 1 && step.unit <= 8,
    `Step ${step.number} has an invalid unit.`,
  );
  if (step.kind === 'lesson' || step.kind === 'review')
    expect(step.words.length > 0, `Step ${step.number} has no vocabulary.`);
  for (const georgian of step.words) {
    const word = wordsByGeorgian.get(georgian);
    expect(Boolean(word), `Step ${step.number} is missing word: ${georgian}`);
    if (word)
      expect(
        wordAudioIds.has(word.id),
        `Step ${step.number} is missing recorded word audio: ${georgian}`,
      );
  }
  for (const [scenarioIndex, scenario] of (step.scenarios ?? []).entries()) {
    expect(
      scenario.correct >= 0 && scenario.correct < scenario.options.length,
      `Step ${step.number}, prompt ${scenarioIndex + 1} has an invalid answer index.`,
    );
    const answer = scenario.options[scenario.correct]
      ?.trim()
      .replace(/[.!?…]+$/u, '');
    expect(
      phraseAudio.has(answer),
      `Step ${step.number}, prompt ${scenarioIndex + 1} is missing answer audio: ${answer}`,
    );
  }
}

for (const entry of phraseAudioManifest) {
  const file = path.join(root, 'public', entry.audio.replace(/^\//, ''));
  try {
    await access(file);
    const details = await stat(file);
    expect(
      details.size > 1_000,
      `Phrase audio is unexpectedly small: ${entry.audio}`,
    );
  } catch {
    failures.push(`Phrase audio file is missing: ${entry.audio}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  const uniqueWords = new Set(speakingUnit.flatMap((step) => step.words)).size;
  const prompts = speakingUnit.reduce(
    (total, step) => total + (step.scenarios?.length ?? 0),
    0,
  );
  console.log(
    JSON.stringify({
      steps: speakingUnit.length,
      units: new Set(speakingUnit.map((step) => step.unit)).size,
      courseWords: uniqueWords,
      speakingPrompts: prompts,
      phraseRecordings: phraseAudioManifest.length,
    }),
  );
}
