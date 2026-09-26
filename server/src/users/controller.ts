import type { Response } from "express";
import type { TenantRequest } from "../middlewares/tenant.js";

import { createUser, deleteUser, getUsers, updateUser } from "./service.js";

import { createUserSchema, updateUserSchema } from "./validation.js";

export const list = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const users = await getUsers(req.tenantId!);

  res.status(200).json({
    success: true,
    data: users,
  });
};

export const create = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const input = createUserSchema.parse(req.body);

  const user = await createUser(req.tenantId!, input);

  res.status(201).json({
    success: true,
    data: user,
  });
};

export const update = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const input = updateUserSchema.parse(req.body);

  const user = await updateUser(req.tenantId!, String(req.params.id), input);

  res.status(200).json({
    success: true,
    data: user,
  });
};

export const remove = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const result = await deleteUser(req.tenantId!, String(req.params.id));

  res.status(200).json({
    success: true,
    ...result,
  });
};
