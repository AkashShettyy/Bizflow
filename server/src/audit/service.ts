import mongoose from "mongoose";
import AuditLog from "../models/auditLog.js";

interface CreateAuditInput {
  tenantId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
}

export const createAuditLog = async (input: CreateAuditInput) => {
  return AuditLog.create({
    tenant: new mongoose.Types.ObjectId(input.tenantId),
    user: new mongoose.Types.ObjectId(input.userId),
    action: input.action,
    resource: input.resource,
    resourceId: input.resourceId
      ? new mongoose.Types.ObjectId(input.resourceId)
      : undefined,
    details: input.details,
  });
};

export const getAuditLogs = async (
  tenantId: string,
  filters?: {
    resource?: string;
    action?: string;
  },
) => {
  const query: {
    tenant: mongoose.Types.ObjectId;
    resource?: string;
    action?: string;
  } = {
    tenant: new mongoose.Types.ObjectId(tenantId),
  };

  if (filters?.resource) {
    query.resource = filters.resource;
  }

  if (filters?.action) {
    query.action = filters.action;
  }

  return AuditLog.find(query)
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
};
