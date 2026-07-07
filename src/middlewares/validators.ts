import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/CustomError';

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (req: Request, _res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    throw new BadRequestError('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new BadRequestError('Password must be at least 6 characters long.');
  }

  next();
};

export const validateVerifyOtp = (req: Request, _res: Response, next: NextFunction): void => {
  const { email, otp } = req.body;

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    throw new BadRequestError('A valid email address is required.');
  }

  if (!otp || typeof otp !== 'string' || otp.length !== 6 || isNaN(Number(otp))) {
    throw new BadRequestError('OTP must be a 6-digit number.');
  }

  next();
};


export const validateLogin = (req: Request, _res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    throw new BadRequestError('A valid email address is required.');
  }

  if (!password || typeof password !== 'string') {
    throw new BadRequestError('Password is required.');
  }

  next();
};
