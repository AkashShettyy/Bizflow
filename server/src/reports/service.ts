import mongoose from "mongoose";
import Customer from "../models/customer.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import Invoice from "../models/invoice.js";

export const getReports = async (tenantId: string) => {
  const tenantObjectId = new mongoose.Types.ObjectId(tenantId);

  const [
    customers,
    projects,
    tasks,
    invoices,
  ] = await Promise.all([
    Customer.aggregate([
      { $match: { tenant: tenantObjectId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),

    Project.aggregate([
      { $match: { tenant: tenantObjectId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),

    Task.aggregate([
      { $match: { tenant: tenantObjectId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),

    Invoice.aggregate([
      { $match: { tenant: tenantObjectId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          amount: { $sum: "$total" },
        },
      },
    ]),
  ]);

  const invoiceSummary = await Invoice.aggregate([
    { $match: { tenant: tenantObjectId } },
    {
      $group: {
        _id: null,
        totalInvoices: { $sum: 1 },
        totalRevenue: { $sum: "$total" },
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

  return {
    customers,
    projects,
    tasks,
    invoices,
    invoiceSummary:
      invoiceSummary[0] ?? {
        totalInvoices: 0,
        totalRevenue: 0,
        paidAmount: 0,
        outstandingAmount: 0,
      },
  };
};