import mongoose, { Document, Schema } from "mongoose";

export interface IAuditLog extends Document {
  tenant: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: mongoose.Types.ObjectId;
  details?: Record<string, unknown>;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
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

    action: {
      type: String,
      required: true,
      trim: true,
    },

    resource: {
      type: String,
      required: true,
      trim: true,
    },

    resourceId: {
      type: Schema.Types.ObjectId,
      required: false,
    },

    details: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

auditLogSchema.index({ tenant: 1, createdAt: -1 });
auditLogSchema.index({ tenant: 1, user: 1 });
auditLogSchema.index({ tenant: 1, resource: 1 });

export default mongoose.model<IAuditLog>("AuditLog", auditLogSchema);
