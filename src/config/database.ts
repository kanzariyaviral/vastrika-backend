import { Sequelize } from 'sequelize';
import { env } from './env';
import { logger } from '../utils/logger';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'postgres',
  logging: env.nodeEnv === 'development' ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL connected successfully.');

    // Dynamically import models to break circular dependencies during initialization
    const User = (await import('../models/User')).default;
    const Otp = (await import('../models/Otp')).default;

    logger.debug(`Registered models: ${[User.name, Otp.name].join(', ')}`);

    // Sync models in development
    if (env.nodeEnv === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Database models synchronized successfully (alter: true).');
    }
  } catch (error) {
    logger.error('Unable to connect to PostgreSQL database:', error);
    process.exit(1);
  }
};

export default sequelize;
