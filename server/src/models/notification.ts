import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  tenant: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  resource?: string;
  resourceId?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    type: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info",
    },

    resource: {
      type: String,
      trim: true,
    },

    resourceId: {
      type: Schema.Types.ObjectId,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ tenant: 1, user: 1, createdAt: -1 });
notificationSchema.index({ tenant: 1, user: 1, isRead: 1 });

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);
