import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  username: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").or(z.literal("")),
  author: z.boolean(),
  adminPanelAccess: z.boolean(),
  featured: z.boolean(),
  sortOrder: z.number().int().min(1),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
