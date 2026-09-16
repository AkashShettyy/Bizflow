import type { Request, Response } from "express";
import { loginUser, registerUser , refreshAccessToken} from "./service.js";
import { loginSchema, registerSchema, refreshSchema } from "./validation.js";
import User from "../models/user.js";
import type { AuthenticatedRequest } from "../middlewares/auth.js";
import Membership from "../models/membership.js";

export const register = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const input = registerSchema.parse(req.body);

  const result = await registerUser(input);

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: result,
  });
};

export const login = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const input = loginSchema.parse(req.body);
  const result = await loginUser(input);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  const user = await User.findById(req.user.userId).select("-password");

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  const membership = await Membership.findOne({
    user: user._id,
    tenant: req.user.tenantId,
    isActive: true,
  }).populate("tenant");

  if (!membership) {
    res.status(404).json({
      success: false,
      message: "Active membership not found",
    });
    return;
  }

  const tenant = membership.tenant as unknown as {
    _id: import("mongoose").Types.ObjectId;
    name: string;
    slug: string;
  };

  res.status(200).json({
    success: true,
    data: {
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
    },
  });
};

export const refresh = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const input = refreshSchema.parse(req.body);
  const result = refreshAccessToken(input);

  res.status(200).json({
    success: true,
    message: "Access token refreshed",
    data: result,
  });
};

export const adminTest = async (
  _req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  res.status(200).json({
    success: true,
    message: "You have administrative access",
  });
};