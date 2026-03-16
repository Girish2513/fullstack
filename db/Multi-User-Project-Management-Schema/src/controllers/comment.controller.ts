import { Request, Response } from "express";
import { CommentRepository } from "../repositories/CommentRepository.js";

export class CommentController {
  static async create(req: Request, res: Response) {
    try {
      const taskId = Number(req.params.taskId);
      const { body, authorId, parentId } = req.body;
      const comment = await CommentRepository.create(body, taskId, authorId, parentId);
      res.status(201).json(comment);
    } catch {
      res.status(500).json({ error: "Failed to create comment" });
    }
  }

  static async getByTask(req: Request, res: Response) {
    try {
      const comments = await CommentRepository.getByTask(Number(req.params.taskId));
      res.json(comments);
    } catch {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  }

  static async getThreaded(req: Request, res: Response) {
    try {
      const comments = await CommentRepository.getThreaded(Number(req.params.taskId));
      res.json(comments);
    } catch {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await CommentRepository.delete(Number(req.params.id));
      res.status(204).send();
    } catch {
      res.status(500).json({ error: "Failed to delete comment" });
    }
  }
}
