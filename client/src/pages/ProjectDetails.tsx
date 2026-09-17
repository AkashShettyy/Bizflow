import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";

interface Customer {
  _id: string;
  name: string;
  email?: string;
  company?: string;
}

interface Project {
  _id: string;
  name: string;
  description?: string;
  customer?: Customer | string;
  status: "planning" | "active" | "on_hold" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  startDate?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        const response = await api.get<{
          success: boolean;
          data: Project;
        }>(`/projects/${id}`);

        setProject(response.data.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load project.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const getStatusClass = (status: Project["status"]) => {
    const classes: Record<Project["status"], string> = {
      planning: "bg-slate-100 text-slate-700",
      active: "bg-blue-100 text-blue-700",
      on_hold: "bg-amber-100 text-amber-700",
      completed: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return classes[status];
  };

  const getPriorityClass = (priority: Project["priority"]) => {
    const classes: Record<Project["priority"], string> = {
      low: "bg-slate-100 text-slate-600",
      medium: "bg-blue-100 text-blue-700",
      high: "bg-orange-100 text-orange-700",
      urgent: "bg-red-100 text-red-700",
    };

    return classes[priority];
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString();
  };

  const getCustomerName = () => {
    if (!project?.customer) return "—";

    if (typeof project.customer === "string") {
      return project.customer;
    }

    return project.customer.name;
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-slate-500">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/projects")}
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Projects
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || "Project not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => navigate("/projects")}
            className="mb-3 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Projects
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">
              {project.name}
            </h2>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClass(
                project.status,
              )}`}
            >
              {project.status.replace("_", " ")}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getPriorityClass(
                project.priority,
              )}`}
            >
              {project.priority}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Project details and information
          </p>
        </div>

        <button
          onClick={() => navigate("/projects")}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Edit Project
        </button>
      </div>

      {/* Project Information */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="font-semibold text-slate-900">Project Information</h3>

          <p className="mt-1 text-sm text-slate-500">
            Basic information about this project.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Project Name
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {project.name}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Customer
            </p>

            <button
              onClick={() => {
                if (project.customer && typeof project.customer !== "string") {
                  navigate(`/customers/${project.customer._id}`);
                }
              }}
              className="mt-1 text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline"
            >
              {getCustomerName()}
            </button>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Status
            </p>

            <div className="mt-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClass(
                  project.status,
                )}`}
              >
                {project.status.replace("_", " ")}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Priority
            </p>

            <div className="mt-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getPriorityClass(
                  project.priority,
                )}`}
              >
                {project.priority}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Start Date
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {formatDate(project.startDate)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Due Date
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {formatDate(project.dueDate)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Project ID
            </p>

            <p className="mt-1 break-all text-sm text-slate-700">
              {project._id}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Created
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {formatDate(project.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Last Updated
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {formatDate(project.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="font-semibold text-slate-900">Description</h3>
        </div>

        <div className="p-6">
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {project.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Tasks */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h3 className="font-semibold text-slate-900">Tasks</h3>

            <p className="mt-1 text-sm text-slate-500">
              Tasks associated with this project.
            </p>
          </div>

          <button
            onClick={() => navigate("/tasks")}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            View Tasks
          </button>
        </div>

        <div className="flex min-h-32 items-center justify-center p-6">
          <div className="text-center">
            <p className="font-medium text-slate-700">Project tasks</p>

            <p className="mt-1 text-sm text-slate-500">
              Project-specific tasks will appear here.
            </p>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="font-semibold text-slate-900">Activity</h3>

          <p className="mt-1 text-sm text-slate-500">
            Recent project activity.
          </p>
        </div>

        <div className="flex min-h-32 items-center justify-center p-6">
          <div className="text-center">
            <p className="font-medium text-slate-700">No activity yet</p>

            <p className="mt-1 text-sm text-slate-500">
              Project activity will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
