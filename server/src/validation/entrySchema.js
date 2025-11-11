import { z } from "zod";

export const entrySchema = z.object({
  tripId: z.string().min(1, "tripId is required"),
  title: z.string().min(2, "Title must be at least 2 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format."),
  photoUrl: z.string().url("Invalid photo URL").optional(),
});