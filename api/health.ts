import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: 'ok',
    hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
    platform: 'vercel',
    timestamp: new Date().toISOString(),
  });
}
