import mongoose from "mongoose";
import User from "../models/user.js";
import Tenant from "../models/tenant.js";
import Membership from "../models/membership.js";
import { hashPassword } from "../utils/password.js";
import type { RegisterInput } from "./validation.js";

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