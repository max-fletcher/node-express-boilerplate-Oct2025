// import { Response } from "express";
import { TAny, TTransaction } from "../types/common.type";
// import { TMockPaginationResult, TPaginationResult } from "../types/common.type";

// Generic type-safe response
export type TSuccessResponse<T = TAny> = {
  data: {
    message: string,
    any: T,
  },
  code: number,
};

export type TErrorResponse = {
  error: {
    message: string,
  },
  code: number,
};

// Doesn't work currently. Need to see why.
// export interface ICommonController<TBase> {
//   getPaginated(): Response<TSuccessResponse<TBase[]> | TErrorResponse>;
//   getAll(): Response<TSuccessResponse<TBase[]> | TErrorResponse>;
//   findById(id: string): Response<TSuccessResponse<TBase> | TErrorResponse>;
//   existsById(id: string): Response<TSuccessResponse<boolean> | TErrorResponse>;
//   findByIds(ids: string[]): Response<TSuccessResponse<TBase[]> | TErrorResponse>;
//   create(data: Partial<TBase>, tx?: TTransaction): Response<TSuccessResponse<TBase> | TErrorResponse>;
//   update(data: Partial<TBase>, id: string, tx?: TTransaction): Response<TSuccessResponse<TBase> | TErrorResponse>;
//   deleteById(id: string, deletedBy: string, tx?: TTransaction): Response<TSuccessResponse<TBase> | TErrorResponse>;
//   hardDeleteById(id: string, tx?: TTransaction): Response<TSuccessResponse<TBase> | TErrorResponse>;
// }

export interface ICommonService<TBase, TCreate, TUpdate, TReturnValue = undefined> {
  getAll(select?: (keyof TBase)[] | null): Promise<Partial<TBase>[]|TReturnValue[]>;
  findById(id: string, select?: (keyof TBase)[] | null): Promise<Partial<TBase> | TReturnValue>;
  existsById(id: string): Promise<boolean>;
  findByIds(id: string[], select?: (keyof TBase)[] | null): Promise<Partial<TBase>[] | TReturnValue[]>;
  create(data: TCreate, tx?: TTransaction): Promise<TBase | TReturnValue>;
  update(data: TUpdate, id: string, tx?: TTransaction): Promise<TReturnValue | TReturnValue>;
  deleteById(id: string, deletedBy: string, tx?: TTransaction): Promise<TBase | TReturnValue>;
  hardDeleteById(id: string, tx?: TTransaction): Promise<TBase | TReturnValue>;
}

export interface ICommonRepository<TBase, TCreate, TUpdate, TReturnValue = undefined> {
  getAll(select?: (keyof TBase)[] | null): Promise<Partial<TBase>[] | TReturnValue[]>;
  findById(id: string, select?: (keyof TBase)[] | null): Promise<Partial<TBase> | TReturnValue | null>;
  existsById(id: string): Promise<boolean>;
  findByIds(id: string[], select?: (keyof TBase)[] | null): Promise<Partial<TBase>[] | TReturnValue[]>;
  create(data: TCreate, tx?: TTransaction): Promise<TBase | TReturnValue>;
  update(data: TUpdate, id: string, tx?: TTransaction): Promise<TBase | TReturnValue>;
  deleteById(id: string, deletedBy: string, tx?: TTransaction): Promise<TBase | TReturnValue>;
  hardDeleteById(id: string, tx?: TTransaction): Promise<TBase | TReturnValue>;
}