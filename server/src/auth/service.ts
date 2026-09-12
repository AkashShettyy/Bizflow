import mongoose from "mongoose";
import User from "../models/user.js";
import Tenant from "../models/tenant.js";
import Membership from "../models/membership.js";
import { hashPassword, comparePassword} from "../utils/password.js";
import type { RegisterInput, LoginInput } from "./validation.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";

export const registerUser = async (input: RegisterInput) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingUser = await User.findOne({
      email: input.email,
    }).session(session);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const slug = input.tenantName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const existingTenant = await Tenant.findOne({
      slug,
    }).session(session);

    if (existingTenant) {
      throw new Error("A company with this name already exists");
    }

    const hashedPassword = await hashPassword(input.password);

    const [tenant] = await Tenant.create(
      [
        {
          name: input.tenantName,
          slug,
        },
      ],
      { session },
    );

    const [user] = await User.create(
      [
        {
          name: input.name,
          email: input.email,
          password: hashedPassword,
        },
      ],
      { session },
    );

    await Membership.create(
      [
        {
          user: user._id,
          tenant: tenant._id,
          role: "owner",
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      tenant: {
        id: tenant._id,
        name: tenant.name,
        slug: tenant.slug,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
export const loginUser = async (input: LoginInput) => {
  const user = await User.findOne({
    email: input.email,
  }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("User account is inactive");
  }

  const passwordMatches = await comparePassword(
    input.password,
    user.password,
  );

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  const membership = await Membership.findOne({
    user: user._id,
    isActive: true,
  }).populate("tenant");

  if (!membership) {
    throw new Error("No active membership found");
  }

  const tenant = membership.tenant as unknown as {
    _id: import("mongoose").Types.ObjectId;
    name: string;
    slug: string;
  };

  const payload = {
    userId: user._id.toString(),
    tenantId: tenant._id.toString(),
    role: membership.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.lastLoginAt = new Date();
  await user.save();

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    tenant: {
      id: tenant._id,
      name: tenant.name,
      slug: tenant.slug,
    },
    role: membership.role,
    accessToken,
    refreshToken,
  };
};