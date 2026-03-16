import express from "express";
import path from "path";
import router from "./routes";
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(logger);
app.use(express.static(path.join(__dirname, "../public")));
app.use(router);

app.use((req, res, next) => {
  const error: any = new Error("Route not found");
  error.status = 404;
  next(error);
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  console.log("\nShutting down server...");

  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
  console.log("done");
});
