import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { generateId } from '../../../utils/id.utils';

export const appUsers = pgTable('appUsers', {
  id: uuid('id').primaryKey().$defaultFn(() => generateId()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  deletedAt: timestamp('deleted_at'),
  deletedBy: uuid('deleted_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});