import { InferSelectModel } from 'drizzle-orm';
import { users } from '../db/rdb/schema';

export type AppUser = InferSelectModel<typeof users>;

// export type StoreAppUser = Partial<InferCreationAttributes<AppUserModel>> & {
//   id: string;
//   phoneNumber: string;
// };