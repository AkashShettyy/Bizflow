import { Router } from "express";
import authenticate from "../middlewares/auth.js";
import requireTenant from "../middlewares/tenant.js";
import { getReportData } from "./controller.js";

const router = Router();

router.use(authenticate);
router.use(requireTenant);

router.get("/", getReportData);

export default router;