import type { Request, Response } from "express";
import { TaskRepository } from "../repositories/TaskRepository.js";
import { mapPgError } from "../db/database.js";
import type { DatabaseError } from "pg";

const taskRepo = new TaskRepository();

export async function getTasks(req: Request, res: Response) {
  const tasks = await taskRepo.findAll();
  res.json(tasks);
}

export async function getTask(req: Request, res: Response) {
  const task = await taskRepo.findById(Number(req.params.id));
  if (!task) return res.status(404).json({ error: "task not found" });
  res.json(task);
}

export async function createTask(req: Request, res: Response) {
  const { title, user_id, project_id } = req.body;
  if (!title || !user_id) return res.status(400).json({ error: "title and user_id required" });

  try {
    const task = await taskRepo.create(title, user_id, project_id);
    res.status(201).json(task);
  } catch (err) {
    const mapped = mapPgError(err as DatabaseError);
    res.status(mapped.status).json({ error: mapped.message });
  }
}

export async function completeTask(req: Request, res: Response) {
  const task = await taskRepo.markComplete(Number(req.params.id));
  if (!task) return res.status(404).json({ error: "task not found" });
  res.json(task);
}

export async function deleteTask(req: Request, res: Response) {
  const task = await taskRepo.deleteById(Number(req.params.id));
  if (!task) return res.status(404).json({ error: "task not found" });
  res.json(task);
}

export async function createProjectWithTasks(req: Request, res: Response) {
  const { project_name, owner_id, tasks } = req.body;
  if (!project_name || !owner_id || !tasks?.length) {
    return res.status(400).json({ error: "project_name, owner_id, and tasks required" });
  }

  try {
    const result = await taskRepo.createProjectWithTasks(project_name, owner_id, tasks);
    res.status(201).json(result);
  } catch (err) {
    const mapped = mapPgError(err as DatabaseError);
    res.status(mapped.status).json({ error: mapped.message });
  }
}
