import { handleLearningContentRequest } from '../../lib/server/paid-content-handlers';

const learningContent = async (request: Request) =>
  handleLearningContentRequest(request);

export default learningContent;

export const config = { path: '/api/learning-content' };
