import { Router } from "express";
import authenticate from "../middlewares/auth.js";
import requireTenant from "../middlewares/tenant.js";
import {
  create,
  getOne,
  list,
  remove,
  update,
} from "./controller.js";

const router = Router();

router.use(authenticate);
router.use(requireTenant);

router.post("/", create);
router.get("/", list);
router.get("/:id", getOne);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;