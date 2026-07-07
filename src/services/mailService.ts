import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

class MailService {
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.initTransporter();
  }

  private async initTransporter() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      // Real SMTP Config
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        tls: {
          rejectUnauthorized: false,
        },
      });
      logger.info('SMTP transporter configured.');
    } else {
      // Local dev fallback: Create Ethereal test account
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
        logger.info(`Ethereal test mail account initialized: ${testAccount.user}`);
      } catch (err) {
        logger.error(
          'Failed to create Ethereal account, falling back to logger-only mail transport:',
          err,
        );
        // Dummy transporter that just logs to console
        this.transporter = {
          sendMail: async (options: any) => {
            logger.info(
              `[MOCK EMAIL SEND] To: ${options.to} | Subject: ${options.subject} | Text: ${options.text}`,
            );
            return { messageId: 'mock-id' };
          },
        } as any;
      }
    }
  }

  public async sendMail(options: MailOptions): Promise<void> {
    try {
      if (!this.transporter) {
        // Wait briefly for init if constructor is not finished
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const from = process.env.SMTP_FROM || '"Vastrika E-Commerce" <no-reply@vastrika.com>';
      const info = await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      logger.info(`Email sent successfully. Message ID: ${info.messageId}`);

      // If using Ethereal, log the preview URL so developer can click and read the actual email!
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        logger.info(`Preview sent email here: ${previewUrl}`);
      }
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }
}

export const mailService = new MailService();
export default mailService;
