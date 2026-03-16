import type { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository.js";
import { mapPgError } from "../db/database.js";
import type { DatabaseError } from "pg";

const userRepo = new UserRepository();

export async function getUsers(req: Request, res: Response) {
  const users = await userRepo.findAll();
  res.json(users);
}

export async function getUser(req: Request, res: Response) {
  const user = await userRepo.findById(Number(req.params.id));
  if (!user) return res.status(404).json({ error: "user not found" });
  res.json(user);
}

export async function createUser(req: Request, res: Response) {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "name and email required" });

  try {
    const user = await userRepo.create(name, email);
    res.status(201).json(user);
  } catch (err) {
    const mapped = mapPgError(err as DatabaseError);
    res.status(mapped.status).json({ error: mapped.message });
  }
}

export async function updateUser(req: Request, res: Response) {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "name and email required" });

  try {
    const user = await userRepo.update(Number(req.params.id), name, email);
    if (!user) return res.status(404).json({ error: "user not found" });
    res.json(user);
  } catch (err) {
    const mapped = mapPgError(err as DatabaseError);
    res.status(mapped.status).json({ error: mapped.message });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const user = await userRepo.deleteById(Number(req.params.id));
  if (!user) return res.status(404).json({ error: "user not found" });
  res.json(user);
}
