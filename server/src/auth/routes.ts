import { Router } from "express";
import {getMe, login, register, refresh,
} from "./controller.js";
import authenticate from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/refresh", refresh);

export default router;