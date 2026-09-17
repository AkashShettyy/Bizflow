import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";

interface Project {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  project: Project | string;
  status?: "todo" | "in_progress" | "review" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  assignedTo?: User | string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const projectId = location.state?.projectId;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const handleBack = () => {
    if (projectId) {
      navigate(`/projects/${projectId}`);
    } else {
      navigate("/tasks");
    }
  };
  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/tasks/${id}`);

        const taskData =
          response.data.task ?? response.data.data ?? response.data;

        setTask(taskData);
      } catch (err) {
        console.error("Failed to fetch task:", err);
        setError("Failed to load task.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const getStatusClass = (status?: Task["status"]) => {
    switch (status) {
      case "todo":
        return "bg-slate-100 text-slate-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "review":
        return "bg-amber-100 text-amber-700";
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getPriorityClass = (priority?: Task["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-slate-100 text-slate-700";
      case "medium":
        return "bg-blue-100 text-blue-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "urgent":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getProjectName = () => {
    if (!task?.project) return "—";

    if (typeof task.project === "string") {
      return task.project;
    }

    return task.project.name;
  };

  const getAssignedUserName = () => {
    if (!task?.assignedTo) return "Unassigned";

    if (typeof task.assignedTo === "string") {
      return task.assignedTo;
    }

    return task.assignedTo.name;
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">Loading task...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="p-6">
        <button
          onClick={handleBack}
          className="mb-3 text-sm text-slate-500 hover:text-slate-900"
        >
          {projectId ? "← Back to Project" : "← Back to Tasks"}
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-700">{error || "Task not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={handleBack}
            className="mb-6 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            {projectId ? "← Back to Project" : "← Back to Tasks"}
          </button>

          <h1 className="text-2xl font-bold text-slate-900">{task.title}</h1>

          <p className="mt-1 text-sm text-slate-500">
            Task details and information
          </p>
        </div>

        <button
          onClick={() => navigate("/tasks")}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Edit Task
        </button>
      </div>

      {/* Task Information */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-900">Task Information</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Title
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {task.title}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Project
            </p>
            <p className="mt-1 text-sm text-slate-700">{getProjectName()}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Status
            </p>
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                task.status,
              )}`}
            >
              {task.status ? task.status.replace("_", " ") : "Unknown"}
            </span>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Priority
            </p>
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClass(
                task.priority,
              )}`}
            >
              {task.priority || "Unknown"}
            </span>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Assigned To
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {getAssignedUserName()}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Due Date
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {formatDate(task.dueDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-900">Description</h2>
        </div>

        <div className="p-6">
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {task.description || "No description provided."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
