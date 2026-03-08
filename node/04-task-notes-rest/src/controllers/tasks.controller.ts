import { Request, Response } from "express";
import * as service from "../services/tasks.service";

export const createTask = (req: Request, res: Response) => {
  const task = service.createTask(req.body);
  res.status(201).json(task);
};

import { paginate } from "../utils/pagination";

export const getTasks = (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const tasks = service.getTasks(req.query);

  const result = paginate(tasks, page, limit);

  res.json(result);
};

export const getTask = (req: Request, res: Response) => {
  const task = service.getTaskById(req.params.id as string);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
};

export const updateTask = (req: Request, res: Response) => {
  const task = service.updateTask(req.params.id as string, req.body);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
};

export const deleteTask = (req: Request, res: Response) => {
  service.deleteTask(req.params.id as string);
  res.status(204).send();
};
