import { Router } from "express";
import authenticate from "../middlewares/auth.js";
import requireTenant from "../middlewares/tenant.js";
import authorize from "../middlewares/authorize.js";
import { list } from "./controller.js";

const router = Router();

router.use(authenticate);
router.use(requireTenant);

router.get("/", authorize("owner", "admin"), list);

export default router;
