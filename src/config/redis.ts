import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

const redisConfig = {
  host: env.redis.host,
  port: env.redis.port,
  maxRetriesPerRequest: null, // Required for BullMQ
};

export const redisConnection = new Redis(redisConfig);

redisConnection.on('connect', () => {
  logger.info('Redis client connected.');
});

redisConnection.on('error', (err) => {
  logger.error('Redis client error:', err);
});

export const connectRedis = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (redisConnection.status === 'ready') {
      resolve();
      return;
    }
    
    redisConnection.once('ready', () => {
      resolve();
    });

    redisConnection.once('error', (err) => {
      reject(err);
    });
  });
};

export default redisConnection;
