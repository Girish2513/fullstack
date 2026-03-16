import type { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository.js";
import { mapPgError } from "../db/database.js";
import type { DatabaseError } from "pg";

const repo = new UserRepository();

export async function getUsers(req: Request, res: Response) {
  res.json(await repo.findAll());
}

export async function getUser(req: Request, res: Response) {
  const user = await repo.findById(Number(req.params.id));
  if (!user) return res.status(404).json({ error: "not found" });
  res.json(user);
}

export async function createUser(req: Request, res: Response) {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "name and email required" });
  try {
    res.status(201).json(await repo.create(name, email));
  } catch (err) {
    const mapped = mapPgError(err as DatabaseError);
    res.status(mapped.status).json({ error: mapped.message });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const user = await repo.deleteById(Number(req.params.id));
  if (!user) return res.status(404).json({ error: "not found" });
  res.json(user);
}
