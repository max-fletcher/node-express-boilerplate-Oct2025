import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export type TTransaction = NodePgDatabase;

export type AnyStringKeyValuePair = {
  [key: string]: string;
};

export type FileUploaderFields = {
  name: string,
  maxCount: number
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyType = any