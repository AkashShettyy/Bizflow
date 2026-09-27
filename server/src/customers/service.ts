import mongoose from "mongoose";

import Customer from "../models/customer.js";
import { createAuditLog } from "../audit/service.js";

interface CreateCustomerInput {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: "lead" | "active" | "inactive";
}

interface UpdateCustomerInput {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: "lead" | "active" | "inactive";
}

export const createCustomer = async (
  tenantId: string,
  userId: string,
  input: CreateCustomerInput,
) => {
  const customer = await Customer.create({
    tenant: new mongoose.Types.ObjectId(tenantId),
    createdBy: new mongoose.Types.ObjectId(userId),
    ...input,
  });

  await createAuditLog({
    tenantId,
    userId,
    action: "CREATE",
    resource: "customer",
    resourceId: customer._id.toString(),
    details: {
      name: customer.name,
      email: customer.email,
      company: customer.company,
    },
  });

  return customer;
};

export const getCustomers = async (tenantId: string) => {
  return Customer.find({
    tenant: tenantId,
  })
    .sort({ createdAt: -1 })
    .lean();
};

export const getCustomerById = async (tenantId: string, customerId: string) => {
  return Customer.findOne({
    _id: customerId,
    tenant: tenantId,
  }).lean();
};

export const updateCustomer = async (
  tenantId: string,
  userId: string,
  customerId: string,
  input: UpdateCustomerInput,
) => {
  const customer = await Customer.findOneAndUpdate(
    {
      _id: customerId,
      tenant: tenantId,
    },
    input,
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  if (!customer) {
    throw new Error("Customer not found");
  }

  await createAuditLog({
    tenantId,
    userId,
    action: "UPDATE",
    resource: "customer",
    resourceId: customer._id.toString(),
    details: {
      name: customer.name,
      email: customer.email,
      company: customer.company,
    },
  });

  return customer;
};

export const deleteCustomer = async (
  tenantId: string,
  userId: string,
  customerId: string,
) => {
  const customer = await Customer.findOneAndDelete({
    _id: customerId,
    tenant: tenantId,
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  await createAuditLog({
    tenantId,
    userId,
    action: "DELETE",
    resource: "customer",
    resourceId: customer._id.toString(),
    details: {
      name: customer.name,
      email: customer.email,
      company: customer.company,
    },
  });

  return customer;
};
