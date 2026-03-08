"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const notes_routes_1 = __importDefault(require("./routes/notes.routes"));
const users_controller_1 = require("./controllers/users.controller");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Log worker PID on each request
app.use((_req, _res, next) => {
    console.log(`[PID ${process.pid}] ${_req.method} ${_req.url}`);
    next();
});
app.use("/users", users_routes_1.default);
app.use(notes_routes_1.default);
app.get("/github/:username", users_controller_1.getGithubProfile);
app.use(errorHandler_1.errorHandler);
exports.default = app;
