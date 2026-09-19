import type { Response } from "express";
import type { TenantRequest } from "../middlewares/tenant.js";
import {
  createInvoiceSchema,
  updateInvoiceSchema,
} from "./validation.js";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "./service.js";

export const create = async (
  req: TenantRequest,
  res: Response
) => {
  const input = createInvoiceSchema.parse(req.body);

  const invoice = await createInvoice(
    req.tenantId!,
    req.user!.userId,
    input
  );

  res.status(201).json({
    success: true,
    data: invoice,
  });
};

export const getAll = async (
  req: TenantRequest,
  res: Response
) => {
  const invoices = await getInvoices(req.tenantId!);

  res.json({
    success: true,
    data: invoices,
  });
};

export const getOne = async (
  req: TenantRequest,
  res: Response
) => {
  const invoice = await getInvoiceById(
    req.tenantId!,
    req.params.id as string
  );

  if (!invoice) {
    res.status(404).json({
      success: false,
      message: "Invoice not found",
    });
    return;
  }

  res.json({
    success: true,
    data: invoice,
  });
};

export const update = async (
  req: TenantRequest,
  res: Response
) => {
  const input = updateInvoiceSchema.parse(req.body);

  const invoice = await updateInvoice(
    req.tenantId!,
    req.params.id as string,
    input
  );

  if (!invoice) {
    res.status(404).json({
      success: false,
      message: "Invoice not found",
    });
    return;
  }

  res.json({
    success: true,
    data: invoice,
  });
};

export const remove = async (
  req: TenantRequest,
  res: Response
) => {
  const invoice = await deleteInvoice(
    req.tenantId!,
    req.params.id as string
  );

  if (!invoice) {
    res.status(404).json({
      success: false,
      message: "Invoice not found",
    });
    return;
  }

  res.json({
    success: true,
    message: "Invoice deleted successfully",
  });
};