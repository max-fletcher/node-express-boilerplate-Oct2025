import express from 'express';
import { validateRequestBody } from '../../utils/validatiion.utils';
import { appVerifyOtpSchema, phoneNoSchema } from '../../schema/app-auth.schema';
import { login, resendOTP, verifyOTP } from '../../controllers/app/auth.controller';
import { JwtMiddleware } from '../../middleware/jwt.middleware';

const AppAuthRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

// Define Routes
AppAuthRouter.post('/login', validateRequestBody(phoneNoSchema), login);
AppAuthRouter.post('/verify-otp', jwtMiddleware.verifyAppUserTokenWithoutOTPVerification, validateRequestBody(appVerifyOtpSchema), verifyOTP);
AppAuthRouter.get('/resend-otp', jwtMiddleware.verifyAppUserTokenWithoutOTPVerification, resendOTP);

export { AppAuthRouter };
