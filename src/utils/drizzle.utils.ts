import { PgTable } from 'drizzle-orm/pg-core';
import { TAny } from '../types/types/common.type';
import { getTableColumns } from 'drizzle-orm';

// Fields to exclude from returned select array
const GLOBAL_EXCLUDE_FIELDS = ['deletedAt', 'deletedBy'] as const; // array
type GlobalExcludeField = typeof GLOBAL_EXCLUDE_FIELDS[number]; // gives type: 'deletedAt' | 'deletedBy'

/**
 * Builds a select shape for specific columns, automatically excluding global fields unless overridden.
 *
 * @param table - The Drizzle table
 * @param columns - List of columns to select
 * @param includeGlobals - If true, includes globally excluded fields
 */
export function selectColumns<T extends PgTable, K extends keyof T['_']['columns']>(table: T, columns: K[], includeGlobals?: boolean ): Pick<T['_']['columns'], K> {
  const selectShape: TAny = {};
  const allColumns = getTableColumns(table);

  for (const col of columns) {
    if (!includeGlobals && GLOBAL_EXCLUDE_FIELDS.includes(col as GlobalExcludeField))
      continue;

    if (allColumns[col as string]) {
      selectShape[col] = allColumns[col as string];
    }
  }

  return selectShape as Pick<T['_']['columns'], K>;
}

/**
 * Builds a select shape excluding specific columns + global exclude fields, unless explicitly overridden.
 *
 * @param table - The Drizzle table
 * @param excludeList - Fields to exclude in addition to global ones
 * @param opts - Options object
 * @param includeGlobals - If true, ignores global exclusions
 */
export function excludeColumns<T extends PgTable,K extends keyof ReturnType<typeof getTableColumns<T>>>(table: T,excludeList: K[], includeGlobals?: boolean) {
  const allColumns = getTableColumns(table);
  const rest = { ...allColumns };

  const excluded = new Set([...excludeList, ...(includeGlobals ? [] : GLOBAL_EXCLUDE_FIELDS)]);

  excluded.forEach((key) => {
    delete rest[key as string];
  });

  return rest;
}