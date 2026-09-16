import Project from "../models/project.js";
import Customer from "../models/customer.js";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "./validation.js";

export const createProject = async (
  tenantId: string,
  userId: string,
  input: CreateProjectInput,
) => {
  const customer = await Customer.findOne({
    _id: input.customer,
    tenant: tenantId,
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  return Project.create({
    tenant: tenantId,
    createdBy: userId,
    ...input,
  });
};

export const getProjects = async (tenantId: string) => {
  return Project.find({
    tenant: tenantId,
  })
    .populate("customer", "name email company")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .lean();
};

export const getProjectById = async (
  tenantId: string,
  projectId: string,
) => {
  return Project.findOne({
    _id: projectId,
    tenant: tenantId,
  })
    .populate("customer", "name email company")
    .populate("createdBy", "name email")
    .lean();
};

export const updateProject = async (
  tenantId: string,
  projectId: string,
  input: UpdateProjectInput,
) => {
  if (input.customer) {
    const customer = await Customer.findOne({
      _id: input.customer,
      tenant: tenantId,
    });

    if (!customer) {
      throw new Error("Customer not found");
    }
  }

  return Project.findOneAndUpdate(
    {
      _id: projectId,
      tenant: tenantId,
    },
    input,
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("customer", "name email company")
    .populate("createdBy", "name email")
    .lean();
};

export const deleteProject = async (
  tenantId: string,
  projectId: string,
) => {
  return Project.findOneAndDelete({
    _id: projectId,
    tenant: tenantId,
  });
};