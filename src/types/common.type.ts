import { Model } from "sequelize";


export type AnyStringKeyValuePair = {
  [key: string]: string;
};

export type FileUploaderFields = {
  name: string,
  maxCount: number
};

export type PaginationResult<T extends Model> = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  nextPage: number | null;
  prevPage: number | null;
  records: T[];
};