import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/CustomError';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export const errorHandler = (
  err: Error | CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let status = 'error';
  let message = 'Something went wrong';
  let stack: string | undefined;

  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    status = err.status;
    message = err.message;
  } else {
    // Log unexpected errors
    logger.error('Unexpected error details:', err);
    if (env.nodeEnv === 'production') {
      message = 'Internal Server Error';
    } else {
      message = err.message;
    }
  }

  if (env.nodeEnv !== 'production') {
    stack = err.stack;
  }

  res.status(statusCode).json({
    status,
    message,
    ...(stack && { stack }),
  });
};

export default errorHandler;
