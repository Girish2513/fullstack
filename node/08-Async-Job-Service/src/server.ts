import app from "./app";
import { startWorker, stopWorker } from "./worker";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startWorker();
});

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

async function gracefulShutdown() {
  console.log("Shutting down gracefully...");
  await stopWorker();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
}
