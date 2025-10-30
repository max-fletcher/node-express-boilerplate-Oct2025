import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { users } from '../../db/rdb/schema';

export type TAppUser = InferSelectModel<typeof users>;

export type TAppUserWithoutPassword = Omit<TAppUser, 'password'>;

export type TAppUserCreate = InferInsertModel<typeof users>;

export type TAppUserUpdate = Partial<TAppUserCreate>;

// export type StoreAppUser = Partial<InferCreationAttributes<AppUserModel>> & {
//   id: string;
//   phoneNumber: string;
// };