import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./auth.js";

export interface TenantRequest extends AuthenticatedRequest {
  tenantId?: string;
}

const requireTenant = (
  req: TenantRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  if (!req.user.tenantId) {
    res.status(403).json({
      success: false,
      message: "Tenant context is required",
    });
    return;
  }

  req.tenantId = req.user.tenantId;

  next();
};

export default requireTenant;