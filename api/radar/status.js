// ==============================================================================
// VERCEL SERVERLESS FUNCTION — /api/radar/status
// ==============================================================================

import { handleHealthCheck } from '../../backend/apiRouter.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const clientApiKey = req.headers['x-serpapi-key'] || '';
  const result = handleHealthCheck(clientApiKey);
  return res.status(200).json(result);
}
