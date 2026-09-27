import { Router } from "express";

import authenticate from "../middlewares/auth.js";
import requireTenant from "../middlewares/tenant.js";
import authorize from "../middlewares/authorize.js";

import { get, list, update } from "./controller.js";

const router = Router();

router.use(authenticate);
router.use(requireTenant);

router.get("/", authorize("owner", "admin"), list);

router.get("/:role", authorize("owner", "admin"), get);

router.put("/:role", authorize("owner", "admin"), update);

export default router;
