import type { Response } from "express";
import { getUsers } from "./service.js";
import type { TenantRequest } from "../middlewares/tenant.js";

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