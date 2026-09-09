import mongoose, { Document, Schema } from "mongoose";

export type MembershipRole = "owner" | "admin" | "manager" | "employee";

export interface IMembership extends Document {
  user: mongoose.Types.ObjectId;
  tenant: mongoose.Types.ObjectId;
  role: MembershipRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const membershipSchema = new Schema<IMembership>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tenant: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    role: {
      type: String,
      enum: ["owner", "admin", "manager", "employee"],
      default: "employee",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

membershipSchema.index({ user: 1, tenant: 1 }, { unique: true });

const Membership = mongoose.model<IMembership>(
  "Membership",
  membershipSchema,
);

export default Membership;