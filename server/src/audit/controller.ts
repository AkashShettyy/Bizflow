import type { Response } from "express";
import type { TenantRequest } from "../middlewares/tenant.js";
import { getAuditLogs } from "./service.js";

export const list = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const logs = await getAuditLogs(req.tenantId!, {
    resource:
      typeof req.query.resource === "string" ? req.query.resource : undefined,

    action: typeof req.query.action === "string" ? req.query.action : undefined,
  });

  res.status(200).json({
    success: true,
    data: logs,
  });
};
