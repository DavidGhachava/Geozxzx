import dictionary from '../data/word-library-extended.json';
import phraseAudioManifest from '../phrase-audio-manifest.json';
import wordAudioManifest from '../word-audio-manifest.json';
import { speakingUnit } from '../speaking-unit';
import { wordLibrary } from '../word-library';
import {
  hasGuidedLearningAccess,
  hasPaidDictionaryAccess,
  privateJson,
} from './paid-content';

export async function handleLearningContentRequest(request: Request) {
  const authorization = request.headers.get('authorization');
  const localPreview = process.env.NODE_ENV === 'development';
  if (!localPreview && !authorization?.startsWith('Bearer '))
    return privateJson({ error: 'Authentication required' }, 401);

  try {
    if (
      !localPreview &&
      !(await hasGuidedLearningAccess(authorization as string))
    )
      return privateJson({ error: 'Guided learning access required' }, 403);
    return privateJson({
      course: speakingUnit,
      words: wordLibrary,
      phraseAudio: phraseAudioManifest.slice(50),
      wordAudio: wordAudioManifest,
    });
  } catch {
    return privateJson({ error: 'Learning content unavailable' }, 503);
  }
}

export async function handleDictionaryRequest(request: Request) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer '))
    return privateJson({ error: 'Authentication required' }, 401);

  try {
    if (!(await hasPaidDictionaryAccess(authorization)))
      return privateJson({ error: 'Dictionary access required' }, 403);
    return privateJson({
      core: wordLibrary,
      words: dictionary.words,
      wordAudio: wordAudioManifest,
    });
  } catch {
    return privateJson({ error: 'Dictionary service unavailable' }, 503);
  }
}
