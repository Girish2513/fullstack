"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const pool_1 = require("./db/pool");
const PORT = process.env.PORT || 3000;
const server = app_1.default.listen(PORT, () => {
    console.log(`[PID ${process.pid}] Server running on port ${PORT}`);
});
function gracefulShutdown(signal) {
    console.log(`[PID ${process.pid}] Received ${signal}, shutting down gracefully...`);
    server.close(async () => {
        console.log(`[PID ${process.pid}] HTTP server closed`);
        try {
            await (0, pool_1.getPool)().end();
            console.log(`[PID ${process.pid}] DB pool closed`);
        }
        catch (err) {
            console.error(`[PID ${process.pid}] Error closing DB pool:`, err);
        }
        process.exit(0);
    });
}
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
