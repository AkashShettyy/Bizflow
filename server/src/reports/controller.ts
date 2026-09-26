import type { Response } from "express";
import type { TenantRequest } from "../middlewares/tenant.js";
import { getReports } from "./service.js";

export const getReportData = async (
  req: TenantRequest,
  res: Response,
) => {
  if (!req.tenantId) {
    return res.status(400).json({
      success: false,
      message: "Tenant not found",
    });
  }

  const data = await getReports(req.tenantId);

  return res.status(200).json({
    success: true,
    data,
  });
};