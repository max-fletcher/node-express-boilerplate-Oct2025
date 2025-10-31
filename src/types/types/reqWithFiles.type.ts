import { Request } from 'express';
import { TAny } from './common.type';

export interface TRequestWithFiles extends Request {
  files?: TAny;
}
