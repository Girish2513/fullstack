import { Router } from "express";
import { TaskController } from "../controllers/task.controller";

const router = Router();

router.post("/", TaskController.createTask);
router.get("/user/:id", TaskController.getUserTasks);
router.patch("/:id/complete", TaskController.completeTask);
router.delete("/:id", TaskController.deleteTask);

export default router;
