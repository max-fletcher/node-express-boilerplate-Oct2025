import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { generateId } from '../../../utils/id.utils';

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().$defaultFn(() => generateId()),
  title: text('title').notNull(),
  description: text('description').notNull(),
  deletedAt: timestamp('deleted_at'),
  deletedBy: uuid('deleted_by'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});