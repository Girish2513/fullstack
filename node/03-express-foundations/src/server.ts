import express from "express";
import path from "path";
import router from "./routes";
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = 3000;

app.use(express.json());

// request logger
app.use(logger);

// static files
app.use(express.static(path.join(__dirname, "../public")));

// routes
app.use(router);

// 404 handler
app.use((req, res, next) => {
  const error: any = new Error("Route not found");
  error.status = 404;
  next(error);
});

// error middleware
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down server...");

  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
  console.log("done");
});
