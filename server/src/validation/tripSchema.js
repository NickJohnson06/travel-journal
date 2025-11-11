import { z } from "zod";

export const tripSchema = z.object({
  name: z.string().min(2, "Trip name must be at least 2 characters."),
  location: z.string().min(2, "Location must be at least 2 characters."),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format."),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format."),
  budget: z.preprocess(
    (val) => Number(val) || 0,
    z.number().min(0, "Budget cannot be negative.")
  ).optional(),
  notes: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
});