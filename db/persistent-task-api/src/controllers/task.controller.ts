import { Request, Response } from "express";
import { TaskRepository } from "../repositories/TaskRepository";

export class TaskController {
  static async createTask(req: Request, res: Response) {
    try {
      const { userId, title } = req.body;

      const task = await TaskRepository.createTask(userId, title);

      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to create task" });
    }
  }

  static async getUserTasks(req: Request, res: Response) {
    try {
      const userId = Number(req.params.id);

      const tasks = await TaskRepository.getTasksByUser(userId);

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  }

  static async completeTask(req: Request, res: Response) {
    try {
      const taskId = Number(req.params.id);

      const task = await TaskRepository.completeTask(taskId);

      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  }

  static async deleteTask(req: Request, res: Response) {
    try {
      const taskId = Number(req.params.id);

      await TaskRepository.deleteTask(taskId);

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  }
}
