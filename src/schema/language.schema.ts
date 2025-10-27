import { z } from 'zod';
import { LanguageService } from '../services/admin/language.services';

const languageService = new LanguageService()

export const createLanguageSchema = z.object({
  name: z
    .string({ required_error: 'Name is required.' })
    .trim()
    .max(255, { message: 'Name cannot exceed 255 characters.' }),
})
.superRefine(async (data, ctx) => {
  const { name } = data;

  const exists = await languageService.languageExistsByName(name)
  if (exists) {
    ctx.addIssue({
      code: 'custom',
      path: ['name'],
      message: 'Language with this name already exists',
    });
  }
});

export const updateLanguageSchema = z.object({
  id: z
    .string({ required_error: 'Id is required.' })
    .trim(),
  name: z
    .string({ required_error: 'Name is required.' })
    .trim()
    .max(255, { message: 'Name cannot exceed 255 characters.' }),
}).superRefine(async (data, ctx) => {
  const { id, name } = data;

  const exists = await languageService.languageExistsByName(name, id)
  if (exists) {
    ctx.addIssue({
      code: 'custom',
      path: ['confirm_password'],
      message: 'Language with this name already exists',
    });
  }
});