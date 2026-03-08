import { Router, Request, Response } from "express";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
  });
});

router.get("/api/info", (req: Request, res: Response) => {
  res.json({
    version: "1.0.0",
    uptime: process.uptime(),
    node: process.version,
    pid: process.pid,
  });
});

router.post("/api/echo", (req: Request, res: Response) => {
  res.json({
    received: req.body,
  });
});

export default router;
