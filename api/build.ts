import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify build secret if provided
  const buildSecret = process.env.BUILD_SECRET;
  if (buildSecret && req.headers.authorization !== `Bearer ${buildSecret}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // This endpoint can be used to trigger builds
    // In a real scenario, you might want to:
    // 1. Validate the request
    // 2. Trigger a build process
    // 3. Return build status
    
    res.status(200).json({ 
      message: 'Build triggered successfully',
      timestamp: new Date().toISOString(),
      status: 'queued'
    });
  } catch (error) {
    console.error('Build trigger error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
