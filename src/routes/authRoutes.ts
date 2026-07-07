import { Router } from 'express';
import AuthController from '../controllers/authController';
import { validateRegister } from '../middlewares/validators';

const router = Router();

router.post('/register', validateRegister, AuthController.register);

export default router;
