import bcryptjs from 'bcryptjs';
import User from '../models/User';
import Otp from '../models/Otp';
import { BadRequestError } from '../utils/CustomError';
import { emailQueue } from '../config/bullmq';
import { logger } from '../utils/logger';

export class AuthService {
  public static async register(email: string, password: string): Promise<any> {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      throw new BadRequestError('Email is already registered.');
    }

    // 2. Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 3. Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Create User (marked unverified by default)
    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      role: 'customer',
      isVerified: false,
    });

    // 5. Store OTP (expires in 15 minutes)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await Otp.create({
      email: normalizedEmail,
      otp: otpCode,
      purpose: 'verification',
      expiresAt,
    });

    // 6. Queue the verification email
    try {
      await emailQueue.add('sendOtp', {
        email: normalizedEmail,
        otp: otpCode,
      });
      logger.info(`Queued sendOtp background job for: ${normalizedEmail}`);
    } catch (err) {
      logger.error('Failed to queue verification email:', err);
      // We don't crash registration if email queuing fails, but log it
    }

    // Return user representation without password
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
  }
}

export default AuthService;
