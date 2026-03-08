import { Request, Response, NextFunction } from "express";
import * as jobsService from "../services/jobs.service";

export async function submitReport(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { payload, idempotencyKey } = req.body;
    if (!payload) {
      res.status(400).json({ error: "payload is required" });
      return;
    }
    const job = await jobsService.submitReport(payload, idempotencyKey);
    res.status(202).json(job);
  } catch (err) {
    next(err);
  }
}

export async function getJobStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "invalid job id" });
      return;
    }
    const job = await jobsService.getJobStatus(id);
    if (!job) {
      res.status(404).json({ error: "job not found" });
      return;
    }
    res.json(job);
  } catch (err) {
    next(err);
  }
}
