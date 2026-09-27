import Task from "../models/task.js";
import Project from "../models/project.js";
import Membership from "../models/membership.js";
import { createAuditLog } from "../audit/service.js";
import type { CreateTaskInput, UpdateTaskInput } from "./validation.js";

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

  const task = await Task.create({
    tenant: tenantId,
    createdBy: userId,
    ...input,
  });

  await createAuditLog({
    tenantId,
    userId,
    action: "CREATE",
    resource: "task",
    resourceId: task._id.toString(),
    details: {
      title: task.title,
      status: task.status,
      priority: task.priority,
    },
  });

  return task;
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

export const getTaskById = async (tenantId: string, taskId: string) => {
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
  userId: string,
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

  const task = await Task.findOneAndUpdate(
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

  if (!task) {
    throw new Error("Task not found");
  }

  await createAuditLog({
    tenantId,
    userId,
    action: "UPDATE",
    resource: "task",
    resourceId: task._id.toString(),
    details: {
      title: task.title,
      status: task.status,
      priority: task.priority,
    },
  });

  return task;
};

export const deleteTask = async (
  tenantId: string,
  userId: string,
  taskId: string,
) => {
  const task = await Task.findOneAndDelete({
    _id: taskId,
    tenant: tenantId,
  });

  if (!task) {
    throw new Error("Task not found");
  }

  await createAuditLog({
    tenantId,
    userId,
    action: "DELETE",
    resource: "task",
    resourceId: task._id.toString(),
    details: {
      title: task.title,
    },
  });

  return task;
};
