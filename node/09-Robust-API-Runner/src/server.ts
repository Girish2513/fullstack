import app from "./app";
import { getPool } from "./db/pool";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`[PID ${process.pid}] Server running on port ${PORT}`);
});

function gracefulShutdown(signal: string) {
  console.log(`[PID ${process.pid}] Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    console.log(`[PID ${process.pid}] HTTP server closed`);
    try {
      await getPool().end();
      console.log(`[PID ${process.pid}] DB pool closed`);
    } catch (err) {
      console.error(`[PID ${process.pid}] Error closing DB pool:`, err);
    }
    process.exit(0);
  });
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
