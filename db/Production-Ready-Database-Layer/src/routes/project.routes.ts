import { Router } from "express";
import { getProjects, getProject, createProject, deleteProject } from "../controllers/project.controller.js";

const router = Router();

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", createProject);
router.delete("/:id", deleteProject);

export default router;
