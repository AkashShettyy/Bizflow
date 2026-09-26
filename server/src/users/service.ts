import bcrypt from "bcryptjs";
import Membership from "../models/membership.js";
import User from "../models/user.js";

export const getUsers = async (tenantId: string) => {
  const memberships = await Membership.find({
    tenant: tenantId,
    isActive: true,
  })
    .populate("user", "name email isActive")
    .sort({ createdAt: -1 })
    .lean();

  return memberships
    .filter((membership) => membership.user)
    .map((membership) => {
      const user = membership.user as unknown as {
        _id: string;
        name: string;
        email: string;
        isActive: boolean;
      };

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        role: membership.role,
      };
    });
};

export const createUser = async (
  tenantId: string,
  input: {
    name: string;
    email: string;
    password: string;
    role: "admin" | "manager" | "employee";
  },
) => {
  const email = input.email.toLowerCase();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const password = await bcrypt.hash(input.password, 12);

  const user = await User.create({
    name: input.name,
    email,
    password,
  });

  await Membership.create({
    user: user._id,
    tenant: tenantId,
    role: input.role,
    isActive: true,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: input.role,
  };
};

export const updateUser = async (
  tenantId: string,
  userId: string,
  input: {
    name?: string;
    email?: string;
    password?: string;
    role?: "admin" | "manager" | "employee";
  },
) => {
  const membership = await Membership.findOne({
    user: userId,
    tenant: tenantId,
    isActive: true,
  });

  if (!membership) {
    throw new Error("User not found");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (input.name !== undefined) {
    user.name = input.name;
  }

  if (input.email !== undefined) {
    user.email = input.email.toLowerCase();
  }

  if (input.password !== undefined) {
    user.password = await bcrypt.hash(input.password, 12);
  }

  await user.save();

  if (input.role !== undefined) {
    membership.role = input.role;
    await membership.save();
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: membership.role,
  };
};

export const deleteUser = async (tenantId: string, userId: string) => {
  const membership = await Membership.findOne({
    user: userId,
    tenant: tenantId,
    isActive: true,
  });

  if (!membership) {
    throw new Error("User not found");
  }

  membership.isActive = false;
  await membership.save();

  return {
    message: "User removed successfully",
  };
};
