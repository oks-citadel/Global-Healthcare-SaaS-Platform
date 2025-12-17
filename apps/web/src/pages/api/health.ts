import type { NextApiRequest, NextApiResponse } from 'next';

type HealthResponse = {
  status: string;
  timestamp: string;
  uptime: number;
  service: string;
  version: string;
  environment: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  // Health check endpoint for Docker health checks
  const healthData: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'unifiedhealth-web',
    version: process.env.VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  };

  res.status(200).json(healthData);
}
