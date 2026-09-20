import { useEffect, useState } from "react";
import api from "../services/api.js";

interface DashboardStats {
  customers: {
    total: number;
    active: number;
  };
  projects: {
    total: number;
    active: number;
  };
  tasks: {
    total: number;
    pending: number;
    overdue: number;
  };
  invoices: {
    total: number;
    paid: number;
    overdue: number;
    totalRevenue: number;
    paidAmount: number;
    outstandingAmount: number;
  };
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const response = await api.get<{
          success: boolean;
          data: DashboardStats;
        }>("/dashboard/stats");

        setStats(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        {error || "Failed to load dashboard"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your business operations
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Customers */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Customers</p>

          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.customers.total}
          </p>

          <p className="mt-1 text-sm text-emerald-600">
            {stats.customers.active} active
          </p>
        </div>

        {/* Projects */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Active Projects</p>

          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.projects.active}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {stats.projects.total} total projects
          </p>
        </div>

        {/* Tasks */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Pending Tasks</p>

          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.tasks.pending}
          </p>

          <p className="mt-1 text-sm text-orange-600">
            {stats.tasks.overdue} overdue
          </p>
        </div>

        {/* Invoices */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Total Invoices</p>

          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.invoices.total}
          </p>

          <p className="mt-1 text-sm text-orange-600">
            {stats.invoices.overdue} overdue
          </p>
        </div>

        {/* Paid */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Paid Amount</p>

          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {formatCurrency(stats.invoices.paidAmount)}
          </p>

          <p className="mt-1 text-sm text-emerald-600">
            {stats.invoices.paid} paid invoices
          </p>
        </div>

        {/* Outstanding */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Outstanding</p>

          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {formatCurrency(stats.invoices.outstandingAmount)}
          </p>

          <p className="mt-1 text-sm text-slate-500">Sent + overdue invoices</p>
        </div>
      </div>

      {/* Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Task Overview
          </h2>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Total Tasks</span>

              <span className="font-medium text-slate-900">
                {stats.tasks.total}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Pending</span>

              <span className="font-medium text-slate-900">
                {stats.tasks.pending}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Overdue</span>

              <span className="font-medium text-orange-600">
                {stats.tasks.overdue}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Invoice Overview
          </h2>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Total Revenue</span>

              <span className="font-medium text-slate-900">
                {formatCurrency(stats.invoices.totalRevenue)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Paid</span>

              <span className="font-medium text-emerald-600">
                {formatCurrency(stats.invoices.paidAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Outstanding</span>

              <span className="font-medium text-orange-600">
                {formatCurrency(stats.invoices.outstandingAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
