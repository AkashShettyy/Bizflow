import type { Response } from "express";
import type { TenantRequest } from "../middlewares/tenant.js";
import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from "./service.js";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "./validation.js";

export const create = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const input = createCustomerSchema.parse(req.body);

  const customer = await createCustomer(
    req.tenantId!,
    req.user!.userId,
    input,
  );

  res.status(201).json({
    success: true,
    message: "Customer created successfully",
    data: customer,
  });
};

export const list = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const customers = await getCustomers(req.tenantId!);

  res.status(200).json({
    success: true,
    data: customers,
  });
};

export const getOne = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const customer = await getCustomerById(
    req.tenantId!,
    req.params.id as string,
  );

  if (!customer) {
    res.status(404).json({
      success: false,
      message: "Customer not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: customer,
  });
};

export const update = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const input = updateCustomerSchema.parse(req.body);

  const customer = await updateCustomer(
    req.tenantId!,
    req.params.id as string,
    input,
  );

  if (!customer) {
    res.status(404).json({
      success: false,
      message: "Customer not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Customer updated successfully",
    data: customer,
  });
};

export const remove = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const customer = await deleteCustomer(
    req.tenantId!,
    req.params.id as string,
  );

  if (!customer) {
    res.status(404).json({
      success: false,
      message: "Customer not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Customer deleted successfully",
  });
};