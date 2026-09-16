import type { Response } from "express";
import type { TenantRequest } from "../middlewares/tenant.js";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "./service.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "./validation.js";

export const create = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const input = createProjectSchema.parse(req.body);

  const project = await createProject(
    req.tenantId!,
    req.user!.userId,
    input,
  );

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: project,
  });
};

export const list = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const projects = await getProjects(req.tenantId!);

  res.status(200).json({
    success: true,
    data: projects,
  });
};

export const getOne = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const project = await getProjectById(
    req.tenantId!,
    req.params.id as string,
  );

  if (!project) {
    res.status(404).json({
      success: false,
      message: "Project not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: project,
  });
};

export const update = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const input = updateProjectSchema.parse(req.body);

  const project = await updateProject(
    req.tenantId!,
    req.params.id as string,
    input,
  );

  if (!project) {
    res.status(404).json({
      success: false,
      message: "Project not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    data: project,
  });
};

export const remove = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const project = await deleteProject(
    req.tenantId!,
    req.params.id as string,
  );

  if (!project) {
    res.status(404).json({
      success: false,
      message: "Project not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
};