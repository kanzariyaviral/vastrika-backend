import { Request, Response, NextFunction } from 'express';
import sequelize from '../config/database';
import redisConnection from '../config/redis';
import { logger } from '../utils/logger';

export const checkHealth = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const healthStatus = {
      status: 'UP',
      timestamp: new Date().toISOString(),
      services: {
        database: 'DOWN',
        redis: 'DOWN',
      },
    };

    // Check database
    try {
      await sequelize.authenticate();
      healthStatus.services.database = 'UP';
    } catch (err) {
      logger.error('Health check: PostgreSQL is down', err);
    }

    // Check redis
    try {
      const ping = await redisConnection.ping();
      if (ping === 'PONG') {
        healthStatus.services.redis = 'UP';
      }
    } catch (err) {
      logger.error('Health check: Redis is down', err);
    }

    const isSystemHealthy =
      healthStatus.services.database === 'UP' &&
      healthStatus.services.redis === 'UP';

    healthStatus.status = isSystemHealthy ? 'UP' : 'DEGRADED';

    res.status(isSystemHealthy ? 200 : 503).json(healthStatus);
  } catch (error) {
    next(error);
  }
};
