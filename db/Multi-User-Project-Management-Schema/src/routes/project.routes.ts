import { Router } from "express";
import { ProjectController } from "../controllers/project.controller.js";

const router = Router();

router.post("/", ProjectController.create);
router.get("/", ProjectController.getAll);
router.get("/:id", ProjectController.getById);
router.get("/:id/tasks", ProjectController.getTasks);
router.get("/owner/:userId", ProjectController.getByOwner);

export default router;
