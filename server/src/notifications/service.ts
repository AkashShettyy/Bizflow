import mongoose from "mongoose";
import Notification from "../models/notification.js";

interface CreateNotificationInput {
  tenantId: string;
  userId: string;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  resource?: string;
  resourceId?: string;
}

export const createNotification = async (input: CreateNotificationInput) => {
  return Notification.create({
    tenant: new mongoose.Types.ObjectId(input.tenantId),
    user: new mongoose.Types.ObjectId(input.userId),
    title: input.title,
    message: input.message,
    type: input.type ?? "info",
    resource: input.resource,
    resourceId: input.resourceId
      ? new mongoose.Types.ObjectId(input.resourceId)
      : undefined,
  });
};

export const getNotifications = async (tenantId: string, userId: string) => {
  return Notification.find({
    tenant: tenantId,
    user: userId,
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
};

export const getUnreadCount = async (tenantId: string, userId: string) => {
  return Notification.countDocuments({
    tenant: tenantId,
    user: userId,
    isRead: false,
  });
};

export const markAsRead = async (
  tenantId: string,
  userId: string,
  notificationId: string,
) => {
  return Notification.findOneAndUpdate(
    {
      _id: notificationId,
      tenant: tenantId,
      user: userId,
    },
    {
      isRead: true,
    },
    {
      new: true,
    },
  ).lean();
};

export const markAllAsRead = async (tenantId: string, userId: string) => {
  const result = await Notification.updateMany(
    {
      tenant: tenantId,
      user: userId,
      isRead: false,
    },
    {
      isRead: true,
    },
  );

  return {
    modifiedCount: result.modifiedCount,
  };
};
