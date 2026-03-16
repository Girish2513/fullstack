import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository.js";
import { DatabaseError } from "pg";

export class UserController {
  static async create(req: Request, res: Response) {
    try {
      const { name, email } = req.body;
      const user = await UserRepository.create(name, email);
      res.status(201).json(user);
    } catch (err) {
      const dbErr = err as DatabaseError;
      if (dbErr.code === "23505") {
        res.status(409).json({ error: "Email already exists" });
        return;
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const user = await UserRepository.getById(Number(req.params.id));
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const users = await UserRepository.getAll();
      res.json(users);
    } catch {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }

  static async setPreferences(req: Request, res: Response) {
    try {
      const prefs = await UserRepository.setPreferences(
        Number(req.params.id),
        req.body.settings
      );
      res.json(prefs);
    } catch {
      res.status(500).json({ error: "Failed to set preferences" });
    }
  }

  static async getPreferences(req: Request, res: Response) {
    try {
      const prefs = await UserRepository.getPreferences(Number(req.params.id));
      if (!prefs) {
        res.status(404).json({ error: "Preferences not found" });
        return;
      }
      res.json(prefs);
    } catch {
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  }
}
