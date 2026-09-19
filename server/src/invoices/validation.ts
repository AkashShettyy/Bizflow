import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const invoiceItemSchema = z.object({
  description: z.string().trim().min(1).max(500),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
});

const baseInvoiceSchema = z.object({
  customer: objectIdSchema,

  invoiceNumber: z
    .string()
    .trim()
    .min(1)
    .max(50),

  issueDate: z.coerce.date(),

  dueDate: z.coerce.date(),

  items: z
    .array(invoiceItemSchema)
    .min(1, "Invoice must contain at least one item"),

  tax: z
    .number()
    .nonnegative()
    .optional()
    .default(0),

  status: z
    .enum(["draft", "sent", "paid", "overdue", "cancelled"])
    .optional()
    .default("draft"),

  notes: z
    .string()
    .trim()
    .max(2000)
    .optional(),
});

export const createInvoiceSchema = baseInvoiceSchema;

export const updateInvoiceSchema = baseInvoiceSchema.partial();

export type CreateInvoiceInput = z.infer<
  typeof createInvoiceSchema
>;

export type UpdateInvoiceInput = z.infer<
  typeof updateInvoiceSchema
>;