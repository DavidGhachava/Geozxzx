import { handleLearningContentRequest } from '@/lib/server/paid-content-handlers';

export async function GET(request: Request) {
  return handleLearningContentRequest(request);
}
