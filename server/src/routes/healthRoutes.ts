import { Router } from 'express';

export const healthRoutes = Router();

healthRoutes.get('/', (_request, response) => {
  response.json({
    success: true,
    data: {
      status: 'ok',
      service: 'sih-artisan-server',
      timestamp: new Date().toISOString(),
    },
  });
});
