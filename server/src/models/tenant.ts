import mongoose, { Document, Schema } from "mongoose";

export interface ITenant extends Document {
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>(
  {
    name: {
      type: String,
      required: [true, "Tenant name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: [true, "Tenant slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tenant = mongoose.model<ITenant>("Tenant", tenantSchema);

export default Tenant;