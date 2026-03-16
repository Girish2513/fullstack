import type { Request, Response } from "express";
import { ProjectRepository } from "../repositories/ProjectRepository.js";
import { mapPgError } from "../db/database.js";
import type { DatabaseError } from "pg";

const projectRepo = new ProjectRepository();

export async function getProjects(req: Request, res: Response) {
  const projects = await projectRepo.findAll();
  res.json(projects);
}

export async function getProject(req: Request, res: Response) {
  const project = await projectRepo.findById(Number(req.params.id));
  if (!project) return res.status(404).json({ error: "project not found" });
  res.json(project);
}

export async function createProject(req: Request, res: Response) {
  const { name, owner_id, description } = req.body;
  if (!name || !owner_id) return res.status(400).json({ error: "name and owner_id required" });

  try {
    const project = await projectRepo.create(name, owner_id, description);
    res.status(201).json(project);
  } catch (err) {
    const mapped = mapPgError(err as DatabaseError);
    res.status(mapped.status).json({ error: mapped.message });
  }
}

export async function deleteProject(req: Request, res: Response) {
  const project = await projectRepo.deleteById(Number(req.params.id));
  if (!project) return res.status(404).json({ error: "project not found" });
  res.json(project);
}
