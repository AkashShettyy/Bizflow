import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../services/api.js";

interface ReportGroup {
  _id: string;
  count: number;
  amount?: number;
}

interface InvoiceSummary {
  totalInvoices: number;
  totalRevenue: number;
  paidAmount: number;
  outstandingAmount: number;
}

interface ReportsData {
  customers: ReportGroup[];
  projects: ReportGroup[];
  tasks: ReportGroup[];
  invoices: ReportGroup[];
  invoiceSummary: InvoiceSummary;
}

function Reports() {
  const [reports, setReports] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: ReportsData;
        }>("/reports");

        setReports(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLabel = (value: string) => {
    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (loading) {
    return (
      <div>
        <p className="text-sm text-slate-500">Loading reports...</p>
      </div>
    );
  }

  if (error || !reports) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        {error || "Failed to load reports"}
      </div>
    );
  }

  const customerData = reports.customers.map((item) => ({
    name: formatLabel(item._id),
    value: item.count,
  }));

  const projectData = reports.projects.map((item) => ({
    name: formatLabel(item._id),
    value: item.count,
  }));

  const taskData = reports.tasks.map((item) => ({
    name: formatLabel(item._id),
    value: item.count,
  }));

  const invoiceData = reports.invoices.map((item) => ({
    name: formatLabel(item._id),
    value: item.count,
    amount: item.amount ?? 0,
  }));

  const chartColors = ["#0f172a", "#64748b", "#10b981", "#f97316", "#ef4444"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>

        <p className="mt-1 text-sm text-slate-500">
          Business performance and operational overview
        </p>
      </div>

      {/* Financial Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Invoices</p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {reports.invoiceSummary.totalInvoices}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Revenue</p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {formatCurrency(reports.invoiceSummary.totalRevenue)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Paid Amount</p>

          <p className="mt-2 text-2xl font-semibold text-emerald-600">
            {formatCurrency(reports.invoiceSummary.paidAmount)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Outstanding</p>

          <p className="mt-2 text-2xl font-semibold text-orange-600">
            {formatCurrency(reports.invoiceSummary.outstandingAmount)}
          </p>
        </div>
      </div>

      {/* Customer + Project */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Customers</h2>

          <p className="mt-1 text-sm text-slate-500">
            Customer distribution by status
          </p>

          <div className="mt-6 h-72">
            {customerData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {customerData.map((_, index) => (
                      <Cell
                        key={`customer-${index}`}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No customer data
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Projects</h2>

          <p className="mt-1 text-sm text-slate-500">Projects by status</p>

          <div className="mt-6 h-72">
            {projectData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar dataKey="value" fill="#0f172a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No project data
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tasks + Invoices */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>

          <p className="mt-1 text-sm text-slate-500">Tasks by status</p>

          <div className="mt-6 h-72">
            {taskData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar dataKey="value" fill="#64748b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No task data
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Invoices</h2>

          <p className="mt-1 text-sm text-slate-500">
            Invoice distribution by status
          </p>

          <div className="mt-6 h-72">
            {invoiceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={invoiceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {invoiceData.map((_, index) => (
                      <Cell
                        key={`invoice-${index}`}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No invoice data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
