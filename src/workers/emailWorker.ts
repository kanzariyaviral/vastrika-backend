import { Worker, Job } from 'bullmq';
import { queueConnection } from '../config/bullmq';
import mailService from '../services/mailService';
import { logger } from '../utils/logger';

export const emailWorker = new Worker(
  'emailQueue',
  async (job: Job) => {
    logger.info(`Processing background job ${job.id} of type ${job.name}`);

    if (job.name === 'sendOtp') {
      const { email, otp } = job.data;
      
      const subject = 'Vastrika - Verify Your Registration';
      const text = `Welcome to Vastrika! Your 6-digit OTP code is: ${otp}. This code is valid for 15 minutes.`;
      const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #712338; border-bottom: 2px solid #712338; padding-bottom: 10px;">Welcome to Vastrika</h2>
          <p>Thank you for registering. Please verify your email address to complete your account setup.</p>
          <div style="background-color: #fdf3f5; padding: 15px; text-align: center; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #c13d5f; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 13px; color: #666;">This verification code is valid for 15 minutes. Please do not share this OTP with anyone.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 11px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} Vastrika. All rights reserved.</p>
        </div>
      `;

      await mailService.sendMail({
        to: email,
        subject,
        text,
        html,
      });
    }
  },
  {
    connection: queueConnection,
    concurrency: 1, // process 1 email at a time
  },
);

emailWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed successfully.`);
});

emailWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed with error:`, err);
});
export default emailWorker;
