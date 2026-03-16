import { Request, Response } from "express";
import { TaskRepository } from "../repositories/TaskRepository.js";
import { ProjectRepository } from "../repositories/ProjectRepository.js";

export class TaskController {
  static async create(req: Request, res: Response) {
    try {
      const { title, userId, projectId, metadata } = req.body;
      const task = await TaskRepository.create(title, userId, projectId, metadata);

      if (projectId) {
        await ProjectRepository.updateTaskCount(projectId);
      }

      res.status(201).json(task);
    } catch {
      res.status(500).json({ error: "Failed to create task" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const task = await TaskRepository.getWithDetails(Number(req.params.id));
      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }
      res.json(task);
    } catch {
      res.status(500).json({ error: "Failed to fetch task" });
    }
  }

  static async getByUser(req: Request, res: Response) {
    try {
      const tasks = await TaskRepository.getByUser(Number(req.params.userId));
      res.json(tasks);
    } catch {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  }

  static async complete(req: Request, res: Response) {
    try {
      const task = await TaskRepository.complete(Number(req.params.id));
      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }
      res.json(task);
    } catch {
      res.status(500).json({ error: "Failed to complete task" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const task = await TaskRepository.delete(Number(req.params.id));
      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      if (task.project_id) {
        await ProjectRepository.updateTaskCount(task.project_id);
      }

      res.status(204).send();
    } catch {
      res.status(500).json({ error: "Failed to delete task" });
    }
  }

  static async addTag(req: Request, res: Response) {
    try {
      const { tag } = req.body;
      await TaskRepository.addTag(Number(req.params.id), tag);
      const task = await TaskRepository.getWithDetails(Number(req.params.id));
      res.json(task);
    } catch {
      res.status(500).json({ error: "Failed to add tag" });
    }
  }

  static async getByMetadata(req: Request, res: Response) {
    try {
      const { key, value } = req.query;
      const tasks = await TaskRepository.getByMetadata(key as string, value as string);
      res.json(tasks);
    } catch {
      res.status(500).json({ error: "Failed to search tasks" });
    }
  }
}
