import { Response } from "express";
import { AnyType, TTransaction } from "../types/common.type";
// import { TMockPaginationResult, TPaginationResult } from "../types/common.type";

// Generic type-safe response
export type TSuccessResponse<T = AnyType> = {
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

// 🧠 Controller Interface (Express-based)
export interface ICommonController<TModel> {
  getPaginated(): Response<TSuccessResponse<TModel[]> | TErrorResponse>;
  getAll(): Response<TSuccessResponse<TModel[]> | TErrorResponse>;
  findById(id: string): Response<TSuccessResponse<TModel> | TErrorResponse>;
  existsById(id: string): Response<TSuccessResponse<boolean> | TErrorResponse>;
  findByIds(ids: string[]): Response<TSuccessResponse<TModel[]> | TErrorResponse>;
  create(data: Partial<TModel>, tx?: TTransaction): Response<TSuccessResponse<TModel> | TErrorResponse>;
  update(data: Partial<TModel>, id: string, tx?: TTransaction): Response<TSuccessResponse<TModel> | TErrorResponse>;
  delete(id: string, tx?: TTransaction): Response<TSuccessResponse<TModel> | TErrorResponse>;
  hardDeleteById(id: string, tx?: TTransaction): Response<TSuccessResponse<TModel> | TErrorResponse>;
}

export interface ICommonService<TModel, TCreate, TUpdate> {
  getAll(select?: (keyof TModel)[] | null): Promise<TModel[]>;
  findById(id: string): Promise<TModel | null>;
  existsById(id: string): Promise<boolean>;
  findByIds(ids: string[]): Promise<TModel[]>;
  create(data: TCreate, tx?: TTransaction): Promise<TModel>;
  update(data: TUpdate, id: string, tx?: TTransaction): Promise<TModel>;
  delete(id: string, tx?: TTransaction): Promise<TModel>;
  hardDeleteById(id: string, tx?: TTransaction): Promise<TModel>;
}

export interface ICommonRepository<TModel, TCreate, TUpdate, TModelReturn> {
  getAll(): Promise<TModelReturn[]>;
  findById(id: string, select?: (keyof TModel)[] | null): Promise<Partial<TModel> | TModelReturn | null>;
  findByIds(id: string[], select?: (keyof TModel)[] | null): Promise<Partial<TModel>[] | TModelReturn[]>;
  // existsById(id: string): Promise<boolean>;
  // findByIds(ids: string[]): Promise<TModel[]>;
  create(data: TCreate, tx?: TTransaction): Promise<TModelReturn>;
  update(data: TUpdate, id: string, tx?: TTransaction): Promise<TModelReturn>;
  // delete(id: string, tx?: TTransaction): Promise<TModel>;
  // hardDeleteById(id: string, tx?: TTransaction): Promise<TModel>;
}