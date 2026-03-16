import { Router } from "express";
import { TaskController } from "../controllers/task.controller.js";

const router = Router();

router.post("/", TaskController.create);
router.get("/search", TaskController.getByMetadata);
router.get("/user/:userId", TaskController.getByUser);
router.get("/:id", TaskController.getById);
router.patch("/:id/complete", TaskController.complete);
router.post("/:id/tags", TaskController.addTag);
router.delete("/:id", TaskController.delete);

export default router;
