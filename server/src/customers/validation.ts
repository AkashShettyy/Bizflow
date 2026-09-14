import { z } from "zod";

const baseCustomerSchema = z.object({
  name: z.string().trim().min(2).max(100),

  email: z.string().trim().email().toLowerCase().optional(),

  phone: z.string().trim().max(30).optional(),

  company: z.string().trim().max(100).optional(),

  status: z
    .enum(["lead", "active", "inactive"])
    .optional(),
});

export const createCustomerSchema = baseCustomerSchema;

export const updateCustomerSchema = baseCustomerSchema.partial();

export type CreateCustomerInput = z.infer<
  typeof createCustomerSchema
>;

export type UpdateCustomerInput = z.infer<
  typeof updateCustomerSchema
>;