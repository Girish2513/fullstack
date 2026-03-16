import express from "express";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { requestLogger } from "./middleware/logger.js";
import { healthCheck, getPoolStatus } from "./db/database.js";

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get("/health/db", async (req, res) => {
  const health = await healthCheck();
  const pool = getPoolStatus();
  res.status(health.status === "healthy" ? 200 : 503).json({ ...health, pool });
});

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

export default app;
