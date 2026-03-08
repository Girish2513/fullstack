import { Router } from "express";
import * as controller from "../controllers/tasks.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", controller.createTask);
router.get("/", controller.getTasks);

export default router;
