import app from "./app.js";
import { testConnection, closePool } from "./db/database.js";

const PORT = process.env.PORT || 3000;

async function start() {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

process.on("SIGINT", async () => {
  console.log("\nShutting down...");
  await closePool();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closePool();
  process.exit(0);
});

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
