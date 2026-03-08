import express from "express";
import usersRoutes from "./routes/users.routes";
import notesRoutes from "./routes/notes.routes";
import { getGithubProfile } from "./controllers/users.controller";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());

// Log worker PID on each request
app.use((_req, _res, next) => {
  console.log(`[PID ${process.pid}] ${_req.method} ${_req.url}`);
  next();
});

app.use("/users", usersRoutes);
app.use(notesRoutes);
app.get("/github/:username", getGithubProfile);

app.use(errorHandler);

export default app;
