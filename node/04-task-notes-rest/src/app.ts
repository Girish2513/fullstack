import express from "express";
import helmet from "helmet";
import cors from "cors";
import { swaggerDocs, swaggerServe } from "./docs/swagger";
import taskRoutes from "./routes/tasks.routes";
import requestId from "./middleware/requestId";
import logger from "./middleware/logger";
import errorHandler from "./middleware/errorHandler";
import { metricsMiddleware, getMetrics } from "./middleware/metrics";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(requestId);
app.use(logger);
app.use(metricsMiddleware);

app.use("/docs", swaggerServe, swaggerDocs);
app.get("/metrics", getMetrics);

app.use("/api/tasks", taskRoutes);

app.use(errorHandler);

export default app;
