import mongoose, { Document, Schema } from "mongoose";

export interface IRolePermission extends Document {
  tenant: mongoose.Types.ObjectId;
  role: "owner" | "admin" | "manager" | "employee";
  permissions: string[];
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const rolePermissionSchema = new Schema<IRolePermission>(
  {
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    role: {
      type: String,
      enum: ["owner", "admin", "manager", "employee"],
      required: true,
    },

    permissions: {
      type: [String],
      default: [],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

rolePermissionSchema.index({ tenant: 1, role: 1 }, { unique: true });

export default mongoose.model<IRolePermission>(
  "RolePermission",
  rolePermissionSchema,
);
