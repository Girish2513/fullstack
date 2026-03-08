import app from "./app";
import db from "./config/db";

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

process.on("SIGINT", () => {
  db.close();

  server.close(() => {
    console.log("Server shutdown complete");
    process.exit(0);
  });
});
