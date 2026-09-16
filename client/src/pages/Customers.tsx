import { useEffect, useMemo, useState } from "react";
import api from "../services/api.js";

interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: "lead" | "active" | "inactive";
}

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: Customer["status"];
}

const initialForm: CustomerForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "lead",
};

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState<CustomerForm>(initialForm);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<{
        success: boolean;
        data: Customer[];
      }>("/customers");

      setCustomers(response.data.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return customers;
    }

    return customers.filter((customer) =>
      [
        customer.name,
        customer.email,
        customer.phone,
        customer.company,
        customer.status,
      ]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(value)),
    );
  }, [customers, search]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await api.post("/customers", {
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        company: form.company || undefined,
        status: form.status,
      });

      setForm(initialForm);
      setShowForm(false);

      await fetchCustomers();
    } catch (error) {
      console.error(error);
      setError("Failed to create customer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customers</h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your business customers.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add Customer
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-xl border bg-white">
        <div className="border-b p-4">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full max-w-md rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-900"
          />
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No customers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-500">
                    Company
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-500">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {customer.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {customer.company || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {customer.email || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {customer.phone || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Add Customer
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new customer.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="text-xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Customer name"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-900"
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-900"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-900"
              />

              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-900"
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900"
              >
                <option value="lead">Lead</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {saving ? "Creating..." : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
