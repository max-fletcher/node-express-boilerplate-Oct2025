import { db } from "../../db/clients/postgres.client";
export type TDB = typeof db;
export type TTransaction = Parameters<Parameters<TDB["transaction"]>[0]>[0];

export type TAnyStringKeyValuePair = {
  [key: string]: string;
};

export type TFileUploaderFields = {
  name: string,
  maxCount: number
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TAny = any