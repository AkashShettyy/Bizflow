import { Router } from "express";
import authenticate from "../middlewares/auth.js";
import requireTenant from "../middlewares/tenant.js";
import { getStats } from "./controller.js";

const router = Router();

router.use(authenticate);
router.use(requireTenant);

router.get("/stats", getStats);

export default router;