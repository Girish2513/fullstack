import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`Request took ${duration}ms`);
  });

  next();
});

app.use((req: any, _res: Response, next: NextFunction) => {
  req.requestId = Math.random().toString(36).substring(2, 10);
  next();
});

// curl http://localhost:3000/users/1

app.use(express.json({ limit: "1mb" }));
//curl -X POST http://localhost:3000/echo \
// -H "Content-Type: application/json" \
// -d '{"name":"Girish","age":22}'
app.use(express.urlencoded({ extended: true }));
// curl -X POST http://localhost:3000/echo \
// -H "Content-Type: application/x-www-form-urlencoded" \
// -d "name=Girish&age=22"

// manual CORS example
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(cors());

app.options("/:any", cors());

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello Express");
});

app.get("/ping", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get("/users/:id", (req: Request, res: Response) => {
  res.json({ userId: req.params.id });
});

app.get("/search", (req: Request, res: Response) => {
  res.json({ query: req.query.q });
});

app.get("/users/:id/posts", (req: Request, res: Response) => {
  res.json({
    userId: req.params.id,
    limit: req.query.limit,
  });
});

app.post("/echo", (req: Request, res: Response) => {
  res.json({ received: req.body });
});

app.get("/status/ok", (_req, res) => {
  res.status(200).json({ message: "OK" });
});

app.post("/status/created", (_req, res) => {
  res.status(201).json({ message: "Created" });
});

app.get("/status/bad", (_req, res) => {
  res.status(400).json({ error: "Bad request" });
});

app.get("/status/notfound", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.get("/custom-header", (_req, res) => {
  res.set("X-App-Version", "1.0");
  res.json({ message: "Header sent" });
});

app.get("/json", (_req, res) => {
  res.json({ framework: "express" });
});

app.get("/text", (_req, res) => {
  res.send("Plain text response");
});

app.get("/file", (_req, res) => {
  const filePath = path.join(__dirname, "../public/sample.txt");
  res.sendFile(filePath);
});

app.get("/google", (_req, res) => {
  res.redirect("https://google.com");
});

const apiRouter = express.Router();
const userRouter = express.Router();

apiRouter.use((req, _res, next) => {
  console.log("API Router Middleware");
  next();
});

userRouter.use((req, _res, next) => {
  console.log("User Router Middleware");
  next();
});

apiRouter.get("/info", (_req, res) => {
  res.json({
    version: "1.0",
    uptime: process.uptime(),
  });
});

userRouter.get("/", (_req, res) => {
  res.json({ users: ["Alice", "Bob"] });
});

userRouter.get("/:id", (req, res) => {
  res.json({ userId: req.params.id });
});

app.use("/api", apiRouter);
app.use("/users-api", userRouter);

app.use("/public", express.static("public"));

app.get("/error", () => {
  throw new Error("Something went wrong");
});

// app.use("*", (_req: Request, res: Response) => {
//   res.status(404).json({ error: "Route not found" });
// });
app.use("/:any", (_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const isDev = process.env.NODE_ENV !== "production";

  res.status(500).json({
    error: err.message,
    ...(isDev && { stack: err.stack }),
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
