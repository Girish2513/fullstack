import { Request, Response, NextFunction } from "express";

const metrics = {
  requestCount: 0,
  statusCodes: {} as Record<string, number>,
  totalLatencyMs: 0,
  routes: {} as Record<string, { count: number; totalLatencyMs: number }>,
};

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const latency = Date.now() - start;
    metrics.requestCount++;
    metrics.totalLatencyMs += latency;

    const code = String(res.statusCode);
    metrics.statusCodes[code] = (metrics.statusCodes[code] || 0) + 1;

    const route = `${req.method} ${req.route?.path || req.path}`;
    if (!metrics.routes[route]) {
      metrics.routes[route] = { count: 0, totalLatencyMs: 0 };
    }
    metrics.routes[route].count++;
    metrics.routes[route].totalLatencyMs += latency;
  });

  next();
}

export function getMetrics(_req: Request, res: Response) {
  const avgLatencyMs =
    metrics.requestCount > 0
      ? Math.round(metrics.totalLatencyMs / metrics.requestCount)
      : 0;

  res.json({
    requestCount: metrics.requestCount,
    avgLatencyMs,
    statusCodes: metrics.statusCodes,
    routes: metrics.routes,
  });
}
