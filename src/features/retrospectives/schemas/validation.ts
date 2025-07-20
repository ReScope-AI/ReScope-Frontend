import { z } from 'zod';

// Sprint form validation schema
export const sprintFormSchema = z.object({
  sprintId: z
    .string()
    .min(1, 'Please select a sprint')
    .refine((val) => val.length > 0, 'Sprint selection is required'),
  retroName: z
    .string()
    .min(2, 'Retro name must be at least 2 characters')
    .max(100, 'Retro name must be less than 100 characters')
    .trim()
    .refine((val) => val.length > 0, 'Retro name is required'),
  teamId: z
    .string()
    .min(1, 'Please select a team')
    .refine((val) => val.length > 0, 'Team selection is required'),
  template: z
    .string()
    .min(1, 'Please select a template')
    .refine(
      (val) => ['start-stop-continue', 'glad-sad-mad', 'daki'].includes(val),
      'Invalid template selected'
    )
});

export type SprintFormData = z.infer<typeof sprintFormSchema>;

// API response schemas
export const teamNameResponseSchema = z.object({
  id: z.string(),
  name: z.string()
});

export const teamNamesResponseSchema = z.array(teamNameResponseSchema);

export type TeamNameResponse = z.infer<typeof teamNameResponseSchema>;
export type TeamNamesResponse = z.infer<typeof teamNamesResponseSchema>;
