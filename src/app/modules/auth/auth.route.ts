import express, { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';

const router: Router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshTokenHandler
);

export const AuthRoutes = router;
