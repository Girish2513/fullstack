import { Request, Response, NextFunction } from "express";
import * as service from "../services/users.service";
import { getGithubUser } from "../services/external.service";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, name } = req.body;
    if (!email || !name) {
      res.status(400).json({ error: "email and name are required" });
      return;
    }
    const user = await service.createUser(email, name);
    res.status(201).json(user);
  } catch (err: any) {
    if (err.code === "23505") {
      res.status(409).json({ error: "email already exists" });
      return;
    }
    next(err);
  }
}

export async function getUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await service.getUser(Number(req.params.id));
    if (!user) {
      res.status(404).json({ error: "user not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function getGithubProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const profile = await getGithubUser(req.params.username as string);
    res.json(profile);
  } catch (err: any) {
    if (err.status) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    next(err);
  }
}
