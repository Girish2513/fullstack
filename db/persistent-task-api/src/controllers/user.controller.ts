import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";

export class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await UserRepository.createUser(email);

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const user = await UserRepository.getUserById(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }
}
