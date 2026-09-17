import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";

interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: "lead" | "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}

function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<{
          success: boolean;
          data: Customer;
        }>(`/customers/${id}`);

        setCustomer(response.data.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load customer.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const getStatusClass = (status: Customer["status"]) => {
    const classes: Record<Customer["status"], string> = {
      lead: "bg-slate-100 text-slate-700",
      active: "bg-blue-100 text-blue-700",
      inactive: "bg-red-100 text-red-700",
    };

    return classes[status];
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-slate-500">Loading customer...</p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/customers")}
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Customers
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || "Customer not found."}
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
            onClick={() => navigate("/customers")}
            className="mb-3 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Customers
          </button>

          <h2 className="text-2xl font-bold text-slate-900">{customer.name}</h2>

          <p className="mt-1 text-sm text-slate-500">
            Customer details and information
          </p>
        </div>

        <button
          onClick={() => navigate("/customers")}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Edit Customer
        </button>
      </div>

      {/* Customer information */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="font-semibold text-slate-900">Customer Information</h3>

          <p className="mt-1 text-sm text-slate-500">
            Basic information about this customer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Name
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {customer.name}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Company
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {customer.company || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Status
            </p>

            <div className="mt-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClass(
                  customer.status,
                )}`}
              >
                {customer.status}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Email
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {customer.email || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Phone
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {customer.phone || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Customer ID
            </p>
            <p className="mt-1 break-all text-sm text-slate-700">
              {customer._id}
            </p>
          </div>
        </div>
      </div>

      {/* Projects placeholder */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="font-semibold text-slate-900">Projects</h3>

          <p className="mt-1 text-sm text-slate-500">
            Projects associated with this customer.
          </p>
        </div>

        <div className="flex min-h-32 items-center justify-center p-6">
          <p className="text-sm text-slate-500">
            Customer projects will appear here.
          </p>
        </div>
      </div>

      {/* Activity placeholder */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="font-semibold text-slate-900">Activity</h3>

          <p className="mt-1 text-sm text-slate-500">
            Recent customer activity.
          </p>
        </div>

        <div className="flex min-h-32 items-center justify-center p-6">
          <p className="text-sm text-slate-500">Activity will appear here.</p>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetails;
