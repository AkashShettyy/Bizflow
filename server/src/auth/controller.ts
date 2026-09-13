import type { Request, Response } from "express";
import { loginUser,registerUser } from "./service.js";
import {loginSchema, registerSchema } from "./validation.js";

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