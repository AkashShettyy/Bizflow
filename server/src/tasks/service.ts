import Task from "../models/task.js";
import Project from "../models/project.js";
import Membership from "../models/membership.js";
import type {
  CreateTaskInput,
  UpdateTaskInput,
} from "./validation.js";

export const createTask = async (
  tenantId: string,
  userId: string,
  input: CreateTaskInput,
) => {
  // Make sure the project belongs to the current tenant.
  const project = await Project.findOne({
    _id: input.project,
    tenant: tenantId,
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // Make sure the assigned user belongs to the current tenant.
  if (input.assignedTo) {
    const membership = await Membership.findOne({
      user: input.assignedTo,
      tenant: tenantId,
      isActive: true,
    });

    if (!membership) {
      throw new Error("Assigned user not found");
    }
  }

  return Task.create({
    tenant: tenantId,
    createdBy: userId,
    ...input,
  });
};

export const getTasks = async (tenantId: string) => {
  return Task.find({
    tenant: tenantId,
  })
    .populate("project", "name status")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .lean();
};

export const getTaskById = async (
  tenantId: string,
  taskId: string,
) => {
  return Task.findOne({
    _id: taskId,
    tenant: tenantId,
  })
    .populate("project", "name status")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .lean();
};

export const updateTask = async (
  tenantId: string,
  taskId: string,
  input: UpdateTaskInput,
) => {
  // If project is being changed,
  // make sure the new project belongs to the tenant.
  if (input.project) {
    const project = await Project.findOne({
      _id: input.project,
      tenant: tenantId,
    });

    if (!project) {
      throw new Error("Project not found");
    }
  }

  // If assignment is being changed,
  // make sure the user belongs to the tenant.
  if (input.assignedTo) {
    const membership = await Membership.findOne({
      user: input.assignedTo,
      tenant: tenantId,
      isActive: true,
    });

    if (!membership) {
      throw new Error("Assigned user not found");
    }
  }

  return Task.findOneAndUpdate(
    {
      _id: taskId,
      tenant: tenantId,
    },
    input,
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("project", "name status")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .lean();
};

export const deleteTask = async (
  tenantId: string,
  taskId: string,
) => {
  return Task.findOneAndDelete({
    _id: taskId,
    tenant: tenantId,
  });
};