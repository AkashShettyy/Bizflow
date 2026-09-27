import { z } from "zod";

export const roles = ["owner", "admin", "manager", "employee"] as const;

export const permissions = [
  "customers.view",
  "customers.create",
  "customers.update",
  "customers.delete",

  "projects.view",
  "projects.create",
  "projects.update",
  "projects.delete",

  "tasks.view",
  "tasks.create",
  "tasks.update",
  "tasks.delete",
  "tasks.assign",

  "invoices.view",
  "invoices.create",
  "invoices.update",
  "invoices.delete",

  "reports.view",

  "users.view",
  "users.create",
  "users.update",
  "users.delete",
] as const;

export const updatePermissionsSchema = z.object({
  permissions: z.array(z.enum(permissions)),
});

export type UpdatePermissionsInput = z.infer<typeof updatePermissionsSchema>;
