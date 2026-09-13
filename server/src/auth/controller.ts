import type { Request, Response } from "express";
import { loginUser, registerUser , refreshAccessToken} from "./service.js";
import { loginSchema, registerSchema, refreshSchema } from "./validation.js";
import User from "../models/user.js";
import type { AuthenticatedRequest } from "../middlewares/auth.js";

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

  const user = await User.findById(req.user.userId).select(
    "-password",
  );

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      tenantId: req.user.tenantId,
      role: req.user.role,
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