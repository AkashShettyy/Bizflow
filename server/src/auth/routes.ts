import { Router } from "express";
import {getMe, login, register, refresh, adminTest,
} from "./controller.js";
import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/authorize.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/refresh", refresh);

router.get(
  "/admin-test",
  authenticate,
  authorize("owner", "admin"),
  adminTest,
);

export default router;