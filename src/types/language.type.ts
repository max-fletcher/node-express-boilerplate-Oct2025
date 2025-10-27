import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { LanguageModel } from '../db/rdb/models';

export type Language = InferAttributes<LanguageModel>;

export type StoreLanguage = Partial<InferCreationAttributes<LanguageModel>> & {
  id: string
  name: string
  updatedBy: string
  createdAt?: string | null
  updatedAt?: string | null
};

export type StoreLanguageData = Omit<StoreLanguage, 'id'>;

export type UpdateLanguageData = Partial<StoreLanguageData>;

export type LanguageWithTimestamps = Language & {
  createdAt: string
  updatedAt: string
};


export type EnrolledLanguages = Omit<Language, 'updatedBy'|'deletedAt'|'deletedBy'> & {
  lessonCount: number
  createdAt: string
  updatedAt: string
};