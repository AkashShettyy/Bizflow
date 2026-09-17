import { Router } from "express";
import { list } from "./controller.js";
import authenticate from "../middlewares/auth.js";
import requireTenant from "../middlewares/tenant.js";

const router = Router();

router.use(authenticate);
router.use(requireTenant);

router.get("/", list);

export default router;