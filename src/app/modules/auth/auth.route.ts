import express, { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

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

router.post(
  '/change-password',
  validateRequest(AuthValidation.changePasswordZodSchema),
  auth(
    ENUM_USER_ROLE.STUDENT,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN
  ),
  AuthController.changePassword
);

export const AuthRoutes = router;
