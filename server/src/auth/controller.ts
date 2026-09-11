import type { Request, Response } from "express";
import { registerUser } from "./service.js";
import { registerSchema } from "./validation.js";

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