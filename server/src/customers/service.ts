import mongoose from "mongoose";
import Customer from "../models/customer.js";

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
  return Customer.create({
    tenant: new mongoose.Types.ObjectId(tenantId),
    createdBy: new mongoose.Types.ObjectId(userId),
    ...input,
  });
};

export const getCustomers = async (tenantId: string) => {
  return Customer.find({
    tenant: tenantId,
  })
    .sort({ createdAt: -1 })
    .lean();
};

export const getCustomerById = async (
  tenantId: string,
  customerId: string,
) => {
  return Customer.findOne({
    _id: customerId,
    tenant: tenantId,
  }).lean();
};

export const updateCustomer = async (
  tenantId: string,
  customerId: string,
  input: UpdateCustomerInput,
) => {
  return Customer.findOneAndUpdate(
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
};

export const deleteCustomer = async (
  tenantId: string,
  customerId: string,
) => {
  return Customer.findOneAndDelete({
    _id: customerId,
    tenant: tenantId,
  });
};