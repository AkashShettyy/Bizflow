import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

interface Customer {
  _id: string;
  name: string;
  email?: string;
  company?: string;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customer: Customer | string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
}

function Invoices() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const response = await api.get<{
        success: boolean;
        data: Invoice[];
      }>("/invoices");

      setInvoices(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const getCustomerName = (customer: Customer | string) => {
    if (typeof customer === "string") {
      return customer;
    }

    return customer.name;
  };

  const getStatusClass = (status: Invoice["status"]) => {
    const classes: Record<Invoice["status"], string> = {
      draft: "bg-slate-100 text-slate-700",
      sent: "bg-blue-100 text-blue-700",
      paid: "bg-emerald-100 text-emerald-700",
      overdue: "bg-orange-100 text-orange-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return classes[status];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Invoices</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your customer invoices
          </p>
        </div>

        <button
          onClick={() => navigate("/invoices/new")}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Create Invoice
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Invoice
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Customer
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Issue Date
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Due Date
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Total
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Status
              </th>

              <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {invoices.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-sm text-slate-500"
                >
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900">
                      {invoice.invoiceNumber}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {getCustomerName(invoice.customer)}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatDate(invoice.issueDate)}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatDate(invoice.dueDate)}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {formatCurrency(invoice.total)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                        invoice.status,
                      )}`}
                    >
                      {invoice.status.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Invoices;
