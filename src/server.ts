import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { initBullMQ } from './config/bullmq';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    logger.info('Initializing Vastrika Backend services...');

    // 1. Connect to PostgreSQL
    await connectDatabase();

    // 2. Connect to Redis
    await connectRedis();

    // 3. Initialize BullMQ Queue
    await initBullMQ();

    // 4. Start HTTP Server
    const server = app.listen(env.port, () => {
      logger.info(`Vastrika Backend listening on http://localhost:${env.port}`);
      logger.info(`Environment: ${env.nodeEnv}`);
    });

    // Graceful Shutdown Handler
    const shutdown = async () => {
      logger.info('Shutting down server gracefully...');
      server.close(async () => {
        logger.info('HTTP server closed.');

        // Add cleanup logic here for DB / Redis connections if needed
        process.exit(0);
      });

      // Force exit after 10s
      setTimeout(() => {
        logger.error('Force shutting down...');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
