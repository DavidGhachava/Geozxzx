import { handleDictionaryRequest } from '../../lib/server/paid-content-handlers';

const dictionary = async (request: Request) => handleDictionaryRequest(request);

export default dictionary;

export const config = { path: '/api/dictionary' };
