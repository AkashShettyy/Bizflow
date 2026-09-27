import { useEffect, useState } from "react";
import api from "../services/api.js";

type Role = "owner" | "admin" | "manager" | "employee";

interface PermissionGroup {
  title: string;
  permissions: string[];
}

const roles: Role[] = ["owner", "admin", "manager", "employee"];

const permissionGroups: PermissionGroup[] = [
  {
    title: "Customers",
    permissions: [
      "customers.view",
      "customers.create",
      "customers.update",
      "customers.delete",
    ],
  },
  {
    title: "Projects",
    permissions: [
      "projects.view",
      "projects.create",
      "projects.update",
      "projects.delete",
    ],
  },
  {
    title: "Tasks",
    permissions: [
      "tasks.view",
      "tasks.create",
      "tasks.update",
      "tasks.delete",
      "tasks.assign",
    ],
  },
  {
    title: "Invoices",
    permissions: [
      "invoices.view",
      "invoices.create",
      "invoices.update",
      "invoices.delete",
    ],
  },
  {
    title: "Reports",
    permissions: ["reports.view"],
  },
  {
    title: "Users",
    permissions: ["users.view", "users.create", "users.update", "users.delete"],
  },
];

const formatPermission = (permission: string) => {
  const [, action] = permission.split(".");

  return action.charAt(0).toUpperCase() + action.slice(1);
};

function RolePermissions() {
  const [selectedRole, setSelectedRole] = useState<Role>("admin");

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchPermissions = async (role: Role) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.get(`/permissions/${role}`);

      setSelectedPermissions(response.data.data.permissions ?? []);
    } catch (error) {
      console.error("Failed to fetch permissions", error);

      setError("Failed to load permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions(selectedRole);
  }, [selectedRole]);

  const togglePermission = (permission: string) => {
    setSelectedPermissions((current) => {
      if (current.includes(permission)) {
        return current.filter((item) => item !== permission);
      }

      return [...current, permission];
    });
  };

  const toggleGroup = (permissions: string[]) => {
    const allSelected = permissions.every((permission) =>
      selectedPermissions.includes(permission),
    );

    if (allSelected) {
      setSelectedPermissions((current) =>
        current.filter((permission) => !permissions.includes(permission)),
      );
    } else {
      setSelectedPermissions((current) => [
        ...new Set([...current, ...permissions]),
      ]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await api.put(`/permissions/${selectedRole}`, {
        permissions: selectedPermissions,
      });

      setMessage("Permissions updated successfully.");
    } catch (error) {
      console.error("Failed to update permissions", error);

      setError("Failed to update permissions.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Role & Permissions
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Configure what each role can access and manage.
        </p>
      </div>

      {/* Role selector */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Select Role
        </label>

        <select
          value={selectedRole}
          onChange={(event) => setSelectedRole(event.target.value as Role)}
          className="w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Permissions */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
            Loading permissions...
          </div>
        ) : (
          permissionGroups.map((group) => {
            const allSelected = group.permissions.every((permission) =>
              selectedPermissions.includes(permission),
            );

            return (
              <div
                key={group.title}
                className="rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                  <h2 className="font-semibold text-slate-900">
                    {group.title}
                  </h2>

                  <button
                    type="button"
                    onClick={() => toggleGroup(group.permissions)}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    {allSelected ? "Clear all" : "Select all"}
                  </button>
                </div>

                <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.permissions.map((permission) => (
                    <label
                      key={permission}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                        className="h-4 w-4 rounded border-slate-300"
                      />

                      <span className="text-sm text-slate-700">
                        {formatPermission(permission)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Save */}
      {!loading && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Permissions"}
          </button>
        </div>
      )}
    </div>
  );
}

export default RolePermissions;
