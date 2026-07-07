import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const getEnvVar = (name: string, defaultValue?: string): string => {
  const value = process.env[name] || defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is missing`);
  }
  return value;
};

export const env = {
  port: parseInt(getEnvVar('PORT', '5000'), 10),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  db: {
    host: getEnvVar('DB_HOST', 'localhost'),
    port: parseInt(getEnvVar('DB_PORT', '5432'), 10),
    user: getEnvVar('DB_USER', 'postgres'),
    password: getEnvVar('DB_PASSWORD', 'postgres'),
    name: getEnvVar('DB_NAME', 'vastrika_db'),
  },
  redis: {
    host: getEnvVar('REDIS_HOST', 'localhost'),
    port: parseInt(getEnvVar('REDIS_PORT', '6379'), 10),
  },
  jwt: {
    secret: getEnvVar('JWT_SECRET'),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '15m'),
    refreshSecret: getEnvVar('JWT_REFRESH_SECRET'),
    refreshExpiresIn: getEnvVar('JWT_REFRESH_EXPIRES_IN', '7d'),
  },
  corsOrigin: getEnvVar('CORS_ORIGIN', 'http://localhost:5173'),
};
