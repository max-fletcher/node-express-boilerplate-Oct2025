import express from 'express';
import { validateRequestBody } from '../../utils/validatiion.utils';
import { adminUserLoginRequestSchema } from '../../schema/admin-login.schema';
import { login } from '../../controllers/admin/auth.controller';

const AdminAuthRouter = express.Router();

// Define Routes
AdminAuthRouter.post('/login', validateRequestBody(adminUserLoginRequestSchema), login);

export { AdminAuthRouter };
