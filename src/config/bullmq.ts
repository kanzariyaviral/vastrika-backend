import { Queue, ConnectionOptions } from 'bullmq';
import { env } from './env';
import { logger } from '../utils/logger';

export const queueConnection: ConnectionOptions = {
  host: env.redis.host,
  port: env.redis.port,
};

// Define core queues
export const emailQueue = new Queue('emailQueue', {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const initBullMQ = async (): Promise<void> => {
  try {
    // Check connection by performing a simple query or verifying connection state
    const client = await emailQueue.client;
    const ping = await (client as any).ping();
    if (ping === 'PONG') {
      logger.info('BullMQ initialized and connected to Redis.');
    } else {
      throw new Error('Redis ping did not return PONG');
    }
  } catch (error) {
    logger.error('Failed to initialize BullMQ:', error);
    throw error;
  }
};
