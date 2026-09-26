import { Router } from "express";

import authenticate from "../middlewares/auth.js";
import requireTenant from "../middlewares/tenant.js";
import authorize from "../middlewares/authorize.js";

import { create, list, remove, update } from "./controller.js";

const router = Router();

router.use(authenticate);
router.use(requireTenant);

// All tenant users can view users
router.get("/", list);

// Only owner and admin can manage users
router.post("/", authorize("owner", "admin"), create);

router.patch("/:id", authorize("owner", "admin"), update);

router.delete("/:id", authorize("owner", "admin"), remove);

export default router;
