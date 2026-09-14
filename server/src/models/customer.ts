import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
  tenant: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: "lead" | "active" | "inactive";
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
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

    company: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    status: {
      type: String,
      enum: ["lead", "active", "inactive"],
      default: "lead",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

customerSchema.index({ tenant: 1, email: 1 });

const Customer = mongoose.model<ICustomer>(
  "Customer",
  customerSchema,
);

export default Customer;