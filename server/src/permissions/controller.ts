import type { Response } from "express";
import type { TenantRequest } from "../middlewares/tenant.js";

import {
  getAllPermissions,
  getPermissions,
  updatePermissions,
} from "./service.js";

import { roles, updatePermissionsSchema } from "./validation.js";

const getRole = (value: string) => {
  if (!roles.includes(value as (typeof roles)[number])) {
    throw new Error("Invalid role");
  }

  return value as (typeof roles)[number];
};

export const list = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const permissions = await getAllPermissions(req.tenantId!);

  res.status(200).json({
    success: true,
    data: permissions,
  });
};

export const get = async (req: TenantRequest, res: Response): Promise<void> => {
  const role = getRole(String(req.params.role));

  const result = await getPermissions(req.tenantId!, role);

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const update = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const input = updatePermissionsSchema.parse(req.body);

  const role = getRole(String(req.params.role));

  const result = await updatePermissions(
    req.tenantId!,
    req.user!.userId,
    role,
    input,
  );

  res.status(200).json({
    success: true,
    data: result,
  });
};
