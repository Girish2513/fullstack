import express from "express";
const app = express();

app.use(express.json());
app.use(express.static("public"));

// api routes

app.get("/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

const users = {
  1: { id: 1, name: "Girish Saana", email: "girish@gmail.com" },
  2: { id: 2, name: "Monkey D Luffy", email: "luffy@gmail.com" },
};

app.get("/users/:id", (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

app.post("/echo", (req, res) => {
  res.status(201).json({ received: req.body });
});

app.get("/set-theme-cookie", (req, res) => {
  res.cookie("theme", "dark", { path: "/" });
  res.json({ message: "Cookie theme=dark set" });
});

app.get("/api/ping", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get("/api/status", (req, res) => {
  res.json({ status: "ok", version: "1.0" });
});

app.get("/api/missing", (req, res) => {
  res.status(404).json({ error: "not found" });
});

app.get("/api/user", (req, res) => {
  res.set("X-Debug-Trace", "req-" + Date.now());
  if (req.query.fail === "1") {
    return res.status(500).json({ error: "Internal server error" });
  }
  res.json({ name: "Girish Saana", email: "girishsaana2513@example.com" });
});

app.get("/old-home", (req, res) => {
  res.redirect(302, "/");
});

app.use((req, res) => {
  res.status(404).send("<h1>404 — Page not found</h1>");
});

const server = app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

server.on("error", (err) => {
  console.error("Failed to start:", err.message);
});
