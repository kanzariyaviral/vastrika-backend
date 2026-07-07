import morgan, { StreamOptions } from 'morgan';
import { logger } from '../utils/logger';
import { env } from '../config/env';

const stream: StreamOptions = {
  write: (message) => logger.http(message.trim()),
};

const skip = () => {
  const nodeEnv = env.nodeEnv || 'development';
  return nodeEnv !== 'development';
};

export const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip },
);
export default requestLogger;
