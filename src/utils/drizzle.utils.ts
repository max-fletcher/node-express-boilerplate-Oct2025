import { PgTable } from 'drizzle-orm/pg-core';
import { AnyType } from '../types/types/common.type';
import { getTableColumns } from 'drizzle-orm';

/**
 * Builds a select shape object for specific columns from a Drizzle table schema
 * @template T - The Drizzle PgTable type
 * @template K - Union type of column names to select
 * @param {T} table - The Drizzle table schema (e.g., users, posts)
 * @param {K[]} columns - Array of column names to include in the selection
 * @returns {Pick<T['_']['columns'], K>} Object with only the specified columns for use in db.select()
 */
export function selectColumns<T extends PgTable, K extends keyof T['_']['columns']>(table: T, columns: K[]): Pick<T['_']['columns'], K> {
  const selectShape: AnyType = {};
  const allColumns = getTableColumns(table);
  
  for (const col of columns) {
    if (allColumns[col as string]) {
      selectShape[col] = allColumns[col as string];
    }
  }

  return selectShape as Pick<T['_']['columns'], K>;
}

/**
 * Builds a select shape that excludes specific columns from a Drizzle table schema
 * @template T - The Drizzle PgTable type
 * @template K - Union type of column names to exclude
 * @param {T} table - The Drizzle table schema (e.g., users, posts)
 * @param {K[]} excludeList - Array of column names to exclude from the selection
 * @returns {Omit<T['_']['columns'], K>} Object with all columns except the excluded ones for use in db.select()
 */
export function excludeColumns<T extends PgTable, K extends keyof ReturnType<typeof getTableColumns<T>>>(table: T, excludeList: K[]) {
  const allColumns = getTableColumns(table);
  const { ...rest } = allColumns;
  
  // Remove excluded columns
  excludeList.forEach(key => {
    delete rest[key as string];
  });
  
  return rest;
}