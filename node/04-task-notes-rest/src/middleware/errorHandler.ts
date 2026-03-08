import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      type: "about:blank",
      title: "Validation Error",
      status: 400,
      detail: err.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; "),
      instance: req.originalUrl,
      errors: err.issues,
    });
  }

  const status = err.status || 400;

  res.status(status).json({
    type: "about:blank",
    title: err.name || "Bad Request",
    status: status,
    detail: err.message,
    instance: req.originalUrl,
  });
}
