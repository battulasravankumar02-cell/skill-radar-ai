// ==============================================================================
// VERCEL SERVERLESS FUNCTION — /api/radar/plan
// ==============================================================================

import { handleGeneratePlan } from '../../backend/apiRouter.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};
    const result = handleGeneratePlan(body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
