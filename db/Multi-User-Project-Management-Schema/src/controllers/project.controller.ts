import { Request, Response } from "express";
import { ProjectRepository } from "../repositories/ProjectRepository.js";
import { TaskRepository } from "../repositories/TaskRepository.js";

export class ProjectController {
  static async create(req: Request, res: Response) {
    try {
      const { name, description, ownerId } = req.body;
      const project = await ProjectRepository.create(name, description, ownerId);
      res.status(201).json(project);
    } catch {
      res.status(500).json({ error: "Failed to create project" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const project = await ProjectRepository.getWithDetails(Number(req.params.id));
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.json(project);
    } catch {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const projects = await ProjectRepository.getAll();
      res.json(projects);
    } catch {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  }

  static async getByOwner(req: Request, res: Response) {
    try {
      const projects = await ProjectRepository.getByOwner(Number(req.params.userId));
      res.json(projects);
    } catch {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  }

  static async getTasks(req: Request, res: Response) {
    try {
      const tasks = await TaskRepository.getByProject(Number(req.params.id));
      res.json(tasks);
    } catch {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  }
}
