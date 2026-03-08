import http from "http";

//create server
const server = http.createServer((req, res) => {
  res.end("Hello World");
});

//start server
server.listen(3000, () => {
  console.log("Server running on port 3000");
});

process.on("SIGINT", () => {
  console.log("\nSIGINT received (Ctrl+C). Shutting down...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Cleaning up...");
  server.close(() => {
    console.log("Server closed gracefully.");
    process.exit(0);
  });
});

console.log("App started.");

process.on("SIGINT", () => {
  console.log("Goodbye 👋");
  process.exit(0);
});
