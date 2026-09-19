import Customer from "../models/customer.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import Invoice from "../models/invoice.js";

export const getDashboardStats = async (tenantId: string) => {
  const [
    totalCustomers,
    activeCustomers,
    totalProjects,
    activeProjects,
    totalTasks,
    pendingTasks,
    overdueTasks,
    totalInvoices,
    paidInvoices,
    overdueInvoices,
  ] = await Promise.all([
    Customer.countDocuments({ tenant: tenantId }),

    Customer.countDocuments({
      tenant: tenantId,
      status: "active",
    }),

    Project.countDocuments({ tenant: tenantId }),

    Project.countDocuments({
      tenant: tenantId,
      status: "active",
    }),

    Task.countDocuments({ tenant: tenantId }),

    Task.countDocuments({
      tenant: tenantId,
      status: { $in: ["todo", "in_progress", "review"] },
    }),

    Task.countDocuments({
      tenant: tenantId,
      dueDate: { $lt: new Date() },
      status: { $nin: ["completed", "cancelled"] },
    }),

    Invoice.countDocuments({ tenant: tenantId }),

    Invoice.countDocuments({
      tenant: tenantId,
      status: "paid",
    }),

    Invoice.countDocuments({
      tenant: tenantId,
      status: "overdue",
    }),
  ]);

  const invoiceTotals = await Invoice.aggregate([
    {
      $match: {
        tenant: tenantId,
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$total",
        },
        paidAmount: {
          $sum: {
            $cond: [
              { $eq: ["$status", "paid"] },
              "$total",
              0,
            ],
          },
        },
        outstandingAmount: {
          $sum: {
            $cond: [
              {
                $in: ["$status", ["sent", "overdue"]],
              },
              "$total",
              0,
            ],
          },
        },
      },
    },
  ]);

  const totals = invoiceTotals[0] ?? {
    totalRevenue: 0,
    paidAmount: 0,
    outstandingAmount: 0,
  };

  return {
    customers: {
      total: totalCustomers,
      active: activeCustomers,
    },

    projects: {
      total: totalProjects,
      active: activeProjects,
    },

    tasks: {
      total: totalTasks,
      pending: pendingTasks,
      overdue: overdueTasks,
    },

    invoices: {
      total: totalInvoices,
      paid: paidInvoices,
      overdue: overdueInvoices,
      totalRevenue: totals.totalRevenue,
      paidAmount: totals.paidAmount,
      outstandingAmount: totals.outstandingAmount,
    },
  };
};