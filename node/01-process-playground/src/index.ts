import dotenv from "dotenv";

dotenv.config();

// Read arguments
const args = process.argv.slice(2);

// Debug flag detection
const isDebug = args.includes("--debug");

// Remove debug flag from args
const cleanArgs = args.filter((arg) => arg !== "--debug");

// Config values
const appName = process.env.APP_NAME || "DefaultApp";
const env = process.env.APP_ENV || "production";

// Basic runtime info
console.log("---- Process Info ----");
console.log("App:", appName);
console.log("Environment:", env);
console.log("Process ID:", process.pid);
console.log("Node Version:", process.version);
console.log("Working Directory:", process.cwd());

// CLI arguments
if (cleanArgs.length > 0) {
  console.log("Arguments:", cleanArgs.join(" "));
} else {
  console.log("No arguments provided");
}

// Debug mode
if (isDebug) {
  console.log("Debug Mode Enabled");
}

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down gracefully.");
  process.exit(0);
});
