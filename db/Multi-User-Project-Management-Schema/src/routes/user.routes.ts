import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();

router.post("/", UserController.create);
router.get("/", UserController.getAll);
router.get("/:id", UserController.getById);
router.put("/:id/preferences", UserController.setPreferences);
router.get("/:id/preferences", UserController.getPreferences);

export default router;
