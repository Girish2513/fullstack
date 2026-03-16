import express from "express";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import commentRoutes from "./routes/comment.routes.js";

const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/", commentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Project Management API running" });
});

export default app;
