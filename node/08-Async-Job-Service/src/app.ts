import express from "express";
import jobsRoutes from "./routes/jobs.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(jobsRoutes);
app.use(errorHandler);

export default app;
