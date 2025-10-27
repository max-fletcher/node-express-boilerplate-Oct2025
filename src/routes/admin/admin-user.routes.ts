import express from 'express';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { getAllAdminUsers, getSingleAdminUser, updateAdmin } from '../../controllers/admin/admin-user.controller';
import { updateAdminUserSchema } from '../../schema/admin-user.schema';
import { validateRequestBody } from '../../utils/validatiion.utils';

const AdminUserRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

AdminUserRouter.get('/', jwtMiddleware.verifyToken, getAllAdminUsers);
AdminUserRouter.get('/:id', jwtMiddleware.verifyToken, getSingleAdminUser);
AdminUserRouter.patch(
  '/:id',
  jwtMiddleware.verifyToken,
  validateRequestBody(updateAdminUserSchema),
  updateAdmin,
);

export { AdminUserRouter };
