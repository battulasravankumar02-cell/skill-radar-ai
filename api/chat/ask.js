// ==============================================================================
// VERCEL SERVERLESS FUNCTION — /api/chat/ask
// Connects AI Chatbot directly to SerpApi Real-Time Web Intelligence
// ==============================================================================

import { handleChatSearch } from '../../backend/apiRouter.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};
    const clientApiKey = req.headers['x-serpapi-key'] || '';
    if (clientApiKey && !body.serpApiKey) {
      body.serpApiKey = clientApiKey;
    }

    const result = await handleChatSearch(body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
