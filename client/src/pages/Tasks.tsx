import { useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

interface Project {
  _id: string;
  name: string;
  status?: string;
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
  project: Project;
  status: "todo" | "in_progress" | "review" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: User;
  dueDate?: string;
}

interface TaskForm {
  title: string;
  description: string;
  project: string;
  status: Task["status"];
  priority: Task["priority"];
  assignedTo: string;
  dueDate: string;
}

const initialForm: TaskForm = {
  title: "",
  description: "",
  project: "",
  status: "todo",
  priority: "medium",
  assignedTo: "",
  dueDate: "",
};

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [form, setForm] = useState<TaskForm>(initialForm);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await api.get<{
        success: boolean;
        data: Task[];
      }>("/tasks");

      setTasks(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get<{
        success: boolean;
        data: Project[];
      }>("/projects");

      setProjects(response.data.data);
    } catch {
      setError("Failed to load projects.");
    }
  };

  const fetchUsers = async () => {
    try {
      /*
       * We will connect this to the users endpoint once
       * User Management is implemented in BizFlow.
       */
      setUsers([]);
    } catch {
      setError("Failed to load users.");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchUsers();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        task.title.toLowerCase().includes(searchText) ||
        task.project?.name?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setForm(initialForm);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await api.post("/tasks", {
        title: form.title,
        description: form.description || undefined,
        project: form.project,
        status: form.status,
        priority: form.priority,
        assignedTo: form.assignedTo || undefined,
        dueDate: form.dueDate || undefined,
      });

      closeForm();
      await fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create task.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingTask) return;

    try {
      setSaving(true);
      setError("");

      await api.patch(`/tasks/${editingTask._id}`, {
        title: form.title,
        description: form.description || undefined,
        project: form.project,
        status: form.status,
        priority: form.priority,
        assignedTo: form.assignedTo || undefined,
        dueDate: form.dueDate || undefined,
      });

      closeForm();
      await fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update task.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);

    setForm({
      title: task.title,
      description: task.description || "",
      project: task.project?._id || "",
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo?._id || "",
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : "",
    });

    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/tasks/${id}`);

      await fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete task.");
    }
  };

  const getStatusClass = (status: Task["status"]) => {
    const classes: Record<Task["status"], string> = {
      todo: "bg-slate-100 text-slate-700",
      in_progress: "bg-blue-100 text-blue-700",
      review: "bg-purple-100 text-purple-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return classes[status];
  };

  const getPriorityClass = (priority: Task["priority"]) => {
    const classes: Record<Task["priority"], string> = {
      low: "text-slate-500",
      medium: "text-blue-600",
      high: "text-orange-600",
      urgent: "text-red-600",
    };

    return classes[priority];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tasks</h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage and track your project tasks.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setForm(initialForm);
            setError("");
            setShowForm(true);
          }}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          + Add Task
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 lg:flex-row">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-500"
        >
          <option value="all">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-500"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Task table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <div className="flex min-h-48 items-center justify-center">
            <p className="text-sm text-slate-500">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center">
            <p className="font-medium text-slate-700">No tasks found</p>

            <p className="mt-1 text-sm text-slate-500">
              Create your first task to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Task
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Project
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Priority
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Assigned To
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Due Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{task.title}</p>

                      {task.description && (
                        <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                          {task.description}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {task.project?.name || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                          task.status,
                        )}`}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                    </td>

                    <td
                      className={`px-6 py-4 text-sm font-semibold capitalize ${getPriorityClass(
                        task.priority,
                      )}`}
                    >
                      {task.priority}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {task.assignedTo?.name || "Unassigned"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(task._id)}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingTask ? "Edit Task" : "Add Task"}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {editingTask
                    ? "Update task information."
                    : "Create a new task."}
                </p>
              </div>

              <button
                onClick={closeForm}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={editingTask ? handleUpdate : handleSubmit}
              className="space-y-5 p-6"
            >
              {/* Title */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Task Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500"
                  placeholder="Enter task title"
                />
              </div>

              {/* Project */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Project
                </label>

                <select
                  name="project"
                  value={form.project}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-500"
                >
                  <option value="">Select project</option>

                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500"
                  placeholder="Enter task description"
                />
              </div>

              {/* Status + Priority */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Assigned To + Due Date */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Assigned To
                  </label>

                  <select
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-500"
                  >
                    <option value="">Unassigned</option>

                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>

                  {users.length === 0 && (
                    <p className="mt-1.5 text-xs text-slate-400">
                      User assignment will be available after User Management is
                      implemented.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? editingTask
                      ? "Updating..."
                      : "Creating..."
                    : editingTask
                      ? "Update Task"
                      : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
