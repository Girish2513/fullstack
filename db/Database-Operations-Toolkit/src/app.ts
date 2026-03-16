import express from "express";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { requestLogger } from "./middleware/logger.js";
import { healthCheck, getMetrics } from "./db/database.js";

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get("/health/db", async (req, res) => {
  const health = await healthCheck();
  res.status(health.status === "healthy" ? 200 : 503).json(health);
});

app.get("/admin/db-status", async (req, res) => {
  const health = await healthCheck();
  const metrics = getMetrics();
  res.json({ ...health, metrics });
});

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

export default app;
