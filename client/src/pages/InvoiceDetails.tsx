import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";

interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customer: Customer | string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  notes?: string;
}

function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchInvoice = async () => {
    try {
      setLoading(true);

      const response = await api.get<{
        success: boolean;
        data: Invoice;
      }>(`/invoices/${id}`);

      setInvoice(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const getCustomer = () => {
    if (!invoice) {
      return null;
    }

    if (typeof invoice.customer === "string") {
      return null;
    }

    return invoice.customer;
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
  const handleStatusChange = async (status: Invoice["status"]) => {
    if (!invoice || status === invoice.status) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");

      const response = await api.patch<{
        success: boolean;
        data: Invoice;
      }>(`/invoices/${invoice._id}`, {
        status,
      });

      setInvoice(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to update invoice status");
    } finally {
      setUpdatingStatus(false);
    }
  };
  const handlePrint = () => {
    window.print();
  };
  const handleDelete = async () => {
    if (!id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await api.delete(`/invoices/${id}`);

      navigate("/invoices");
    } catch (err) {
      console.error(err);
      setError("Failed to delete invoice");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Loading invoice...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="p-6">
        <button
          type="button"
          onClick={() => navigate("/invoices")}
          className="mb-4 text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to Invoices
        </button>

        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error || "Invoice not found"}
        </div>
      </div>
    );
  }

  const customer = getCustomer();

  return (
    <div className="p-6 print:p-0">
      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/invoices")}
          className="mb-3 text-sm text-slate-500 hover:text-slate-900 print:hidden"
        >
          ← Back to Invoices
        </button>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">
                {invoice.invoiceNumber}
              </h1>

              <select
                value={invoice.status}
                onChange={(event) =>
                  handleStatusChange(event.target.value as Invoice["status"])
                }
                disabled={updatingStatus}
                className={`rounded-full border-0 px-3 py-1 text-xs font-medium capitalize outline-none ${getStatusClass(
                  invoice.status,
                )}`}
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Invoice details and billing information
            </p>
          </div>

          <div className="flex gap-2 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Print Invoice
            </button>
            <button
              type="button"
              onClick={() => navigate(`/invoices/${invoice._id}/edit`)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit Invoice
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Invoice Information */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Invoice Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Invoice Number
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {invoice.invoiceNumber}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Issue Date
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {formatDate(invoice.issueDate)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">
                Due Date
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Customer
          </h2>

          {customer ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">
                  Name
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {customer.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-slate-400">
                  Email
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {customer.email || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-slate-400">
                  Phone
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {customer.phone || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-slate-400">
                  Company
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {customer.company || "—"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Customer information unavailable.
            </p>
          )}
        </div>

        {/* Items */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Invoice Items
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Description
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Quantity
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Unit Price
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {item.description}
                    </td>

                    <td className="px-6 py-4 text-right text-sm text-slate-700">
                      {item.quantity}
                    </td>

                    <td className="px-6 py-4 text-right text-sm text-slate-700">
                      {formatCurrency(item.unitPrice)}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-medium text-slate-900">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end border-t border-slate-200 p-6">
            <div className="w-full space-y-3 md:w-80">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>

                <span className="font-medium text-slate-900">
                  {formatCurrency(invoice.subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax</span>

                <span className="font-medium text-slate-900">
                  {formatCurrency(invoice.tax)}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-3">
                <span className="font-semibold text-slate-900">Total</span>

                <span className="text-xl font-semibold text-slate-900">
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Notes</h2>

            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {invoice.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvoiceDetails;
