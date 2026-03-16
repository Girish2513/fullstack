import { Router } from "express";
import { getTasks, getTask, createTask, completeTask, deleteTask, createProjectWithTasks } from "../controllers/task.controller.js";

const router = Router();
router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", createTask);
router.patch("/:id/complete", completeTask);
router.delete("/:id", deleteTask);
router.post("/with-project", createProjectWithTasks);

export default router;
