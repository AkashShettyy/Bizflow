import type { Response } from "express";
import type { TenantRequest } from "../middlewares/tenant.js";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "./service.js";

export const list = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const notifications = await getNotifications(req.tenantId!, req.user!.userId);

  res.status(200).json({
    success: true,
    data: notifications,
  });
};

export const unreadCount = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const count = await getUnreadCount(req.tenantId!, req.user!.userId);

  res.status(200).json({
    success: true,
    data: {
      count,
    },
  });
};

export const read = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const notification = await markAsRead(
    req.tenantId!,
    req.user!.userId,
    String(req.params.id),
  );

  if (!notification) {
    res.status(404).json({
      success: false,
      message: "Notification not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: notification,
  });
};

export const readAll = async (
  req: TenantRequest,
  res: Response,
): Promise<void> => {
  const result = await markAllAsRead(req.tenantId!, req.user!.userId);

  res.status(200).json({
    success: true,
    data: result,
  });
};
