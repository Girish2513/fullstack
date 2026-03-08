import { Router } from "express";
import * as controller from "../controllers/tasks.controller";
import { validate } from "../middleware/validate";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";

const router = Router();

router.post("/", validate(createTaskSchema), controller.createTask);
router.get("/", controller.getTasks);
router.get("/:id", controller.getTask);
router.patch("/:id", validate(updateTaskSchema), controller.updateTask);
router.delete("/:id", controller.deleteTask);

export default router;
