import { Request } from 'express';
import { AppUserPayload, AdminUserPayload } from '../../schema/token-payload.schema';
import { TAny } from './common.type';

export interface AdminAuthenticatedRequest extends Request {
  user?: AdminUserPayload;
  files?: TAny;
}

export interface AppAuthenticatedRequest extends Request {
  user?: AppUserPayload;
  files?: TAny;
}