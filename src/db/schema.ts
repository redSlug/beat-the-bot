import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export type Winner = {
  id: number;
  created_at: string;
  name: string;
  score: number;
};

export const winnersTable = sqliteTable('winners', {
  id: integer('id').primaryKey(),
  created_at: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
  name: text('name').notNull(),
  score: integer('score').notNull(),
});
