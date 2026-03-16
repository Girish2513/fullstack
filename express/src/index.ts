import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";

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

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cors());

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

app.get("/status/ok", (_req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

app.post("/status/created", (_req: Request, res: Response) => {
  res.status(201).json({ message: "Resource created" });
});

app.get("/status/bad", (_req: Request, res: Response) => {
  res.status(400).json({ error: "Bad Request" });
});

app.get("/status/notfound", (_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

app.get("/custom-header", (_req: Request, res: Response) => {
  res.set("X-App-Version", "1.0");
  res.json({ message: "Header sent" });
});

app.get("/json", (_req: Request, res: Response) => {
  res.json({ framework: "express" });
});

app.get("/text", (_req: Request, res: Response) => {
  res.send("Plain text response");
});

app.get("/file", (_req: Request, res: Response) => {
  const filePath = path.join(__dirname, "../public/sample.txt");
  res.sendFile(filePath);
});

app.get("/google", (_req: Request, res: Response) => {
  res.redirect("https://google.com");
});

const apiRouter = express.Router();

apiRouter.get("/info", (_req: Request, res: Response) => {
  res.json({
    version: "1.0",
    uptime: process.uptime(),
  });
});

app.use("/api", apiRouter);

app.use("/public", express.static("public"));

app.get("/error", () => {
  throw new Error("Something went wrong");
});

// app.use("*", (_req: Request, res: Response) => {
//   res.status(404).json({ error: "Route not found" });
// });

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    error: err.message,
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Shutting down...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
