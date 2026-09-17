import type { Response } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "./service.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "./validation.js";
import type { TenantRequest } from "../middlewares/tenant.js";

export const create = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const input = createTaskSchema.parse(req.body);

  const task = await createTask(
    req.tenantId!,
    req.user!.userId,
    input,
  );

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
};

export const list = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const tasks = await getTasks(req.tenantId!);

  res.status(200).json({
    success: true,
    data: tasks,
  });
};

export const getOne = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const task = await getTaskById(
    req.tenantId!,
    req.params.id as string,
  );

  if (!task) {
    res.status(404).json({
      success: false,
      message: "Task not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: task,
  });
};

export const update = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const input = updateTaskSchema.parse(req.body);

  const task = await updateTask(
    req.tenantId!,
    req.params.id as string,
    input,
  );

  if (!task) {
    res.status(404).json({
      success: false,
      message: "Task not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: task,
  });
};

export const remove = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const task = await deleteTask(
    req.tenantId!,
    req.params.id as string,
  );

  if (!task) {
    res.status(404).json({
      success: false,
      message: "Task not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
};