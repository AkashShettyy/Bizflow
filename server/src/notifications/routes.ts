import { Router } from "express";
import authenticate from "../middlewares/auth.js";
import requireTenant from "../middlewares/tenant.js";
import { list, unreadCount, read, readAll } from "./controller.js";

const router = Router();

router.use(authenticate);
router.use(requireTenant);

router.get("/", list);
router.get("/unread-count", unreadCount);
router.patch("/:id/read", read);
router.patch("/read-all", readAll);

export default router;
