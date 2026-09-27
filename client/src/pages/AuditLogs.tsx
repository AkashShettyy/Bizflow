import { useEffect, useState } from "react";
import api from "../services/api.js";

interface AuditLog {
  _id: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: {
    name?: string;
    title?: string;
    invoiceNumber?: string;
    email?: string;
    company?: string;
    total?: number;
    status?: string;
  };
  user?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [resource, setResource] = useState("");
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (resource) {
        params.append("resource", resource);
      }

      if (action) {
        params.append("action", action);
      }

      const response = await api.get(`/audit-logs?${params.toString()}`);

      setLogs(response.data.data);
    } catch (error) {
      console.error("Failed to fetch audit logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [resource, action]);

  const getDescription = (log: AuditLog) => {
    const name =
      log.details?.name ||
      log.details?.title ||
      log.details?.invoiceNumber ||
      log.resource;

    return `${log.action} ${log.resource}: ${name}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>

        <p className="mt-1 text-sm text-gray-500">
          Track important activities performed in your organization.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 rounded-lg border bg-white p-4">
        <select
          value={resource}
          onChange={(e) => setResource(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="">All Resources</option>
          <option value="customer">Customers</option>
          <option value="project">Projects</option>
          <option value="task">Tasks</option>
          <option value="invoice">Invoices</option>
        </select>

        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
        </select>

        <button
          onClick={() => {
            setResource("");
            setAction("");
          }}
          className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Clear Filters
        </button>
      </div>

      {/* Logs */}
      <div className="overflow-hidden rounded-lg border bg-white">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading audit logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No audit logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium">User</th>

                  <th className="px-6 py-3 font-medium">Action</th>

                  <th className="px-6 py-3 font-medium">Resource</th>

                  <th className="px-6 py-3 font-medium">Description</th>

                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {log.user?.name ?? "Unknown"}
                      </div>

                      <div className="text-xs text-gray-500">
                        {log.user?.email}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-6 py-4 capitalize">{log.resource}</td>

                    <td className="px-6 py-4">{getDescription(log)}</td>

                    <td className="px-6 py-4 text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditLogs;
