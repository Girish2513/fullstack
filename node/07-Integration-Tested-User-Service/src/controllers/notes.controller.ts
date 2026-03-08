import { Request, Response, NextFunction } from "express";
import * as service from "../services/notes.service";

export async function createNote(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = Number(req.params.userId);
    const { content } = req.body;
    if (!content) {
      res.status(400).json({ error: "content is required" });
      return;
    }
    const note = await service.createNote(userId, content);
    res.status(201).json(note);
  } catch (err: any) {
    if (
      err.code === "23503" ||
      (err.message && err.message.includes("foreign key constraint"))
    ) {
      res.status(404).json({ error: "user not found" });
      return;
    }
    next(err);
  }
}

export async function getNotesByUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const notes = await service.getNotesByUser(Number(req.params.userId));
    res.json(notes);
  } catch (err) {
    next(err);
  }
}

export async function getNote(req: Request, res: Response, next: NextFunction) {
  try {
    const note = await service.getNote(Number(req.params.id));
    if (!note) {
      res.status(404).json({ error: "note not found" });
      return;
    }
    res.json(note);
  } catch (err) {
    next(err);
  }
}
