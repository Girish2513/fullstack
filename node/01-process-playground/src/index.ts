import dotenv from "dotenv";

dotenv.config();

const args = process.argv.slice(2);
const isDebug = args.includes("--debug");
const cleanArgs = args.filter((arg) => arg !== "--debug");

const appName = process.env.APP_NAME || "DefaultApp";
const env = process.env.APP_ENV || "production";

console.log("App:", appName);
console.log("Environment:", env);
console.log("Process ID:", process.pid);
console.log("Node Version:", process.version);
console.log("Working Directory:", process.cwd());

if (cleanArgs.length > 0) {
  console.log("Arguments:", cleanArgs.join(" "));
} else {
  console.log("No arguments provided");
}

if (isDebug) {
  console.log("Debug Mode Enabled");
}

process.on("SIGINT", () => {
  console.log("\nShutting down gracefully.");
  process.exit(0);
});
