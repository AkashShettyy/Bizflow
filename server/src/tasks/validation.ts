import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const baseTaskSchema = z.object({
  title: z.string().trim().min(2).max(150),

  description: z
    .string()
    .trim()
    .max(2000)
    .optional(),

  project: objectIdSchema,

  status: z
    .enum([
      "todo",
      "in_progress",
      "review",
      "completed",
      "cancelled",
    ])
    .optional(),

  priority: z
    .enum(["low", "medium", "high", "urgent"])
    .optional(),

  assignedTo: objectIdSchema.optional(),

  dueDate: z.coerce.date().optional(),
});

export const createTaskSchema = baseTaskSchema;

export const updateTaskSchema = baseTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;