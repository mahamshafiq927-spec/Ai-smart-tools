import type { IncomingMessage, ServerResponse } from 'http';
import { handleApiRoute } from '../server/apiMiddleware.ts';

// Standard Vercel Serverless Function handler
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Ensure the request URL contains /api/generate
  if (!req.url || !req.url.startsWith('/api/')) {
    req.url = '/api/generate';
  }
  await handleApiRoute(req, res);
}
