import mongoose, { Document, Schema } from "mongoose";

export type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

export type ProjectPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export interface IProject extends Document {
  tenant: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  customer: mongoose.Types.ObjectId;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: Date;
  dueDate?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["planning", "active", "on_hold", "completed", "cancelled"],
      default: "planning",
      required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      required: true,
    },

    startDate: {
      type: Date,
    },

    dueDate: {
      type: Date,
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

projectSchema.index({ tenant: 1, status: 1 });
projectSchema.index({ tenant: 1, customer: 1 });

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;