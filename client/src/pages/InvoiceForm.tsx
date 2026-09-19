import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

interface Customer {
  _id: string;
  name: string;
  email?: string;
  company?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

function InvoiceForm() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [customer, setCustomer] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [dueDate, setDueDate] = useState("");
  const [tax, setTax] = useState(0);
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      description: "",
      quantity: 1,
      unitPrice: 0,
    },
  ]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: Customer[];
        }>("/customers");

        setCustomers(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load customers");
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }, [items]);

  const total = subtotal + tax;

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    setItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const addItem = () => {
    setItems((currentItems) => [
      ...currentItems,
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      return;
    }

    setItems((currentItems) =>
      currentItems.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!customer) {
      setError("Please select a customer");
      return;
    }

    if (!invoiceNumber.trim()) {
      setError("Please enter an invoice number");
      return;
    }

    if (!dueDate) {
      setError("Please select a due date");
      return;
    }

    if (items.some((item) => !item.description.trim())) {
      setError("Please enter a description for every item");
      return;
    }

    if (items.some((item) => item.quantity <= 0 || item.unitPrice < 0)) {
      setError("Please enter valid quantity and price values");
      return;
    }

    try {
      setSaving(true);

      await api.post("/invoices", {
        customer,
        invoiceNumber: invoiceNumber.trim(),
        issueDate,
        dueDate,
        items,
        tax,
        status: "draft",
        notes: notes.trim() || undefined,
      });

      navigate("/invoices");
    } catch (err) {
      console.error(err);
      setError("Failed to create invoice");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/invoices")}
          className="mb-3 text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to Invoices
        </button>

        <h1 className="text-2xl font-semibold text-slate-900">
          Create Invoice
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a new invoice for your customer
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Invoice Information
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Customer
                </label>

                <select
                  value={customer}
                  onChange={(event) => setCustomer(event.target.value)}
                  disabled={loadingCustomers}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                >
                  <option value="">
                    {loadingCustomers
                      ? "Loading customers..."
                      : "Select customer"}
                  </option>

                  {customers.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                      {item.company ? ` — ${item.company}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Invoice Number
                </label>

                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(event) => setInvoiceNumber(event.target.value)}
                  placeholder="INV-0001"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Issue Date
                </label>

                <input
                  type="date"
                  value={issueDate}
                  onChange={(event) => setIssueDate(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Due Date
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Invoice Items
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add the products or services included in this invoice.
                </p>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const amount = item.quantity * item.unitPrice;

                return (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                      <div className="md:col-span-5">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Description
                        </label>

                        <input
                          type="text"
                          value={item.description}
                          onChange={(event) =>
                            updateItem(index, "description", event.target.value)
                          }
                          placeholder="Website Development"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Quantity
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(
                              index,
                              "quantity",
                              Number(event.target.value),
                            )
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Unit Price
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(event) =>
                            updateItem(
                              index,
                              "unitPrice",
                              Number(event.target.value),
                            )
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Amount
                        </label>

                        <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900">
                          {formatCurrency(amount)}
                        </div>
                      </div>

                      <div className="flex items-end justify-end md:col-span-1">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                          className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="flex justify-end">
            <div className="w-full rounded-xl border border-slate-200 bg-white p-6 md:w-96">
              <h2 className="mb-5 text-lg font-semibold text-slate-900">
                Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>

                  <span className="font-medium text-slate-900">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="tax" className="text-slate-500">
                    Tax
                  </label>

                  <input
                    id="tax"
                    type="number"
                    min="0"
                    step="0.01"
                    value={tax}
                    onChange={(event) => setTax(Number(event.target.value))}
                    className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-right text-sm outline-none focus:border-slate-500"
                  />
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">Total</span>

                    <span className="text-lg font-semibold text-slate-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              placeholder="Additional notes for this invoice..."
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/invoices")}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default InvoiceForm;
