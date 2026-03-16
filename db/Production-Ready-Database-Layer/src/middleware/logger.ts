import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const correlationId = randomUUID().slice(0, 8);
  (req as any).correlationId = correlationId;

  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${correlationId}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });

  next();
}
