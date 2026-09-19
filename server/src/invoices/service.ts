import Invoice from "../models/invoice.js";
import Customer from "../models/customer.js";
import type {
  CreateInvoiceInput,
  UpdateInvoiceInput,
} from "./validation.js";

const calculateTotals = (
  items: CreateInvoiceInput["items"],
  tax: number
) => {
  const calculatedItems = items.map((item) => ({
    ...item,
    amount: item.quantity * item.unitPrice,
  }));

  const subtotal = calculatedItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const total = subtotal + tax;

  return {
    items: calculatedItems,
    subtotal,
    total,
  };
};

export const createInvoice = async (
  tenantId: string,
  userId: string,
  input: CreateInvoiceInput
) => {
  const customer = await Customer.findOne({
    _id: input.customer,
    tenant: tenantId,
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  const tax = input.tax ?? 0;

  const { items, subtotal, total } = calculateTotals(
    input.items,
    tax
  );

  return Invoice.create({
    tenant: tenantId,
    createdBy: userId,
    customer: input.customer,
    invoiceNumber: input.invoiceNumber,
    issueDate: input.issueDate,
    dueDate: input.dueDate,
    items,
    subtotal,
    tax,
    total,
    status: input.status ?? "draft",
    notes: input.notes,
  });
};

export const getInvoices = async (tenantId: string) => {
  return Invoice.find({ tenant: tenantId })
    .populate("customer", "name email company")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

export const getInvoiceById = async (
  tenantId: string,
  invoiceId: string
) => {
  return Invoice.findOne({
    _id: invoiceId,
    tenant: tenantId,
  })
    .populate("customer", "name email company phone")
    .populate("createdBy", "name email");
};

export const updateInvoice = async (
  tenantId: string,
  invoiceId: string,
  input: UpdateInvoiceInput
) => {
  const existingInvoice = await Invoice.findOne({
    _id: invoiceId,
    tenant: tenantId,
  });

  if (!existingInvoice) {
    return null;
  }

  if (input.customer) {
    const customer = await Customer.findOne({
      _id: input.customer,
      tenant: tenantId,
    });

    if (!customer) {
      throw new Error("Customer not found");
    }
  }

  const updatedData: Record<string, unknown> = {
    ...input,
  };

  if (input.items) {
    const tax = input.tax ?? existingInvoice.tax ?? 0;

    const { items, subtotal, total } = calculateTotals(
      input.items,
      tax
    );

    updatedData.items = items;
    updatedData.subtotal = subtotal;
    updatedData.tax = tax;
    updatedData.total = total;
  } else if (input.tax !== undefined) {
    const tax = input.tax;

    updatedData.tax = tax;
    updatedData.total = existingInvoice.subtotal + tax;
  }

  return Invoice.findOneAndUpdate(
    {
      _id: invoiceId,
      tenant: tenantId,
    },
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("customer", "name email company phone")
    .populate("createdBy", "name email");
};

export const deleteInvoice = async (
  tenantId: string,
  invoiceId: string
) => {
  return Invoice.findOneAndDelete({
    _id: invoiceId,
    tenant: tenantId,
  });
};