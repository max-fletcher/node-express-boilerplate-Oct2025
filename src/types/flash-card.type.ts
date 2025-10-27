import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { FlashCardModel } from '../db/rdb/models/flash-card.model';

export type FlashCard = InferAttributes<FlashCardModel>;

export type StoreFlashCard = Partial<InferCreationAttributes<FlashCardModel>> & {
  id: string
  lessonId: string
  cardOrder: number
  frontText: string
  backText: string
  updatedBy: string
  createdAt?: string | null
  updatedAt?: string | null
};

export type StoreFlashCardData = Omit<StoreFlashCard, 'id'>;

export type UpdateFlashCardData = Partial<StoreFlashCardData>;

export type FlashCardWithTimestamps = FlashCard & {
  createdAt: string
  updatedAt: string
};