import { z } from "zod";

const baseProjectSchema = z.object({
  name: z.string().trim().min(2).max(150),

  description: z.string().trim().max(2000).optional(),

  customer: z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid customer ID",
  ),

  status: z
    .enum(["planning", "active", "on_hold", "completed", "cancelled"])
    .optional(),

  priority: z
    .enum(["low", "medium", "high", "urgent"])
    .optional(),

  startDate: z.coerce.date().optional(),

  dueDate: z.coerce.date().optional(),
});

export const createProjectSchema = baseProjectSchema;

export const updateProjectSchema = baseProjectSchema.partial();

export type CreateProjectInput = z.infer<
  typeof createProjectSchema
>;

export type UpdateProjectInput = z.infer<
  typeof updateProjectSchema
>;