import mongoose from "mongoose";
import RolePermission from "../models/rolePermission.js";
import type { UpdatePermissionsInput } from "./validation.js";

type Role = "owner" | "admin" | "manager" | "employee";

export const getPermissions = async (tenantId: string, role: Role) => {
  const tenantObjectId = new mongoose.Types.ObjectId(tenantId);

  const result = await RolePermission.findOne({
    tenant: tenantObjectId,
    role,
  }).lean();

  return {
    role,
    permissions: result?.permissions ?? [],
  };
};

export const updatePermissions = async (
  tenantId: string,
  userId: string,
  role: Role,
  input: UpdatePermissionsInput,
) => {
  const tenantObjectId = new mongoose.Types.ObjectId(tenantId);

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const result = await RolePermission.findOneAndUpdate(
    {
      tenant: tenantObjectId,
      role,
    },
    {
      $set: {
        permissions: input.permissions,
        updatedBy: userObjectId,
      },
      $setOnInsert: {
        tenant: tenantObjectId,
        role,
        createdBy: userObjectId,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    },
  ).lean();

  return {
    role,
    permissions: result?.permissions ?? [],
  };
};

export const getAllPermissions = async (tenantId: string) => {
  const tenantObjectId = new mongoose.Types.ObjectId(tenantId);

  const results = await RolePermission.find({
    tenant: tenantObjectId,
  })
    .sort({ role: 1 })
    .lean();

  return results.map((item) => ({
    role: item.role,
    permissions: item.permissions,
  }));
};
