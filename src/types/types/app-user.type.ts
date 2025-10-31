import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { appUsers } from '../../db/rdb/db-schema';

export type TAppUser = Omit<InferSelectModel<typeof appUsers>, 'deletedAt'|'deletedBy'>;

export type TAppUserWithoutPassword = Omit<TAppUser, 'password'|'deletedAt'|'deletedBy'>;

export type TAppUserCreate = InferInsertModel<typeof appUsers>;

export type TAppUserUpdate = Partial<TAppUserCreate>;