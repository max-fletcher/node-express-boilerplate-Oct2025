import { z } from 'zod';
import { FAMILIARITY } from '../constants/enums';
import { FlashCardService } from '../services/admin/flash-card.services';

const flashCardService = new FlashCardService();

export const createFlashCardViewedSchema = z.object({
  flashCardId: z
    .string({ required_error: 'Flash card id is required.' })
    .trim(),
  familiarity: z
    .enum(FAMILIARITY, { required_error: 'Familiarity is required.' })
    .optional()
    .nullable(),
})
.superRefine(async (data, ctx) => {
  const { flashCardId } = data;

  const flashCard = await flashCardService.flashCardExistsById(flashCardId)
  if(!flashCard){
    ctx.addIssue({
      code: 'custom',
      path: ['flashCardId'],
      message: 'Flash card not found.',
    });
  }
});