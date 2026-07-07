import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService';

export class AuthController {
  public static async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await AuthService.register(email, password);

      res.status(201).json({
        status: 'success',
        message: 'Registration successful. Verification OTP has been sent to your email.',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
