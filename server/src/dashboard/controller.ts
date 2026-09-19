import type { Response } from "express";
import type { TenantRequest } from "../middlewares/tenant.js";
import { getDashboardStats } from "./service.js";

export const getStats = async (
  req: TenantRequest,
  res: Response,
) => {
  if (!req.tenantId) {
    return res.status(400).json({
      success: false,
      message: "Tenant not found",
    });
  }

  const data = await getDashboardStats(req.tenantId);

  return res.status(200).json({
    success: true,
    data,
  });
};