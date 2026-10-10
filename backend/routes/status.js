// ==============================================================================
// VERCEL SERVERLESS FUNCTION — /api/radar/status
// ==============================================================================

import { handleHealthCheck } from '../../server/apiRouter.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const result = handleHealthCheck();
  return res.status(200).json(result);
}
