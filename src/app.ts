import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { env } from './config/env';
import requestLogger from './middlewares/requestLogger';
import errorHandler from './middlewares/errorHandler';
import apiRouter from './routes';
import { NotFoundError } from './utils/CustomError';

const app: Application = express();

// Secure app by setting various HTTP headers
app.use(helmet());

// Enable CORS with configurations
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);

// Compress responses
app.use(compression());

// Parse incoming JSON payloads
app.use(express.json());

// Parse urlencoded payloads
app.use(express.urlencoded({ extended: true }));

// Log HTTP requests
app.use(requestLogger);

// API Version 1 prefix routing
app.use('/api/v1', apiRouter);

// Fallback for unmatched routes
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('The requested route does not exist.'));
});

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
