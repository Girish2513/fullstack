import express from "express";
import { projects, articles, team } from "./data.js";
import {
  homePage,
  projectsPage,
  projectDetailPage,
  articlesPage,
  articleDetailPage,
  teamPage,
} from "./views.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send(homePage(projects, articles, team));
});

app.get("/projects", (req, res) => {
  res.send(projectsPage(projects));
});

app.get("/articles", (req, res) => {
  res.send(articlesPage(articles));
});

app.get("/articles/:id", (req, res) => {
  const article = articles.find((a) => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: "Article not found" });
  res.send(articleDetailPage(article));
});

app.get("/team", (req, res) => {
  res.send(teamPage(team));
});

// CSR — empty shell, JS fetches data
app.get("/projects/csr", (req, res) => {
  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Projects (CSR) — TeamHub</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background: #f0f0f0; }
  </style>
</head>
<body>
  <nav><a href="/">Home</a></nav>
  <h1>Projects (CSR)</h1>
  <div id="project-list">Loading...</div>
  <script>
    fetch("/api/projects")
      .then(res => res.json())
      .then(projects => {
        let html = "<table><tr><th>Name</th><th>Status</th><th>Lead</th><th>Tech Stack</th></tr>";
        projects.forEach(p => {
          html += "<tr><td>" + p.name + "</td><td>" + p.status + "</td><td>" + p.lead + "</td><td>" + p.techStack.join(", ") + "</td></tr>";
        });
        html += "</table>";
        document.getElementById("project-list").innerHTML = html;
      });
  </script>
</body>
</html>`);
});

// SSR — server builds full HTML before sending
app.get("/projects/ssr", (req, res) => {
  const rows = projects
    .map(
      (p) =>
        `<tr><td>${p.name}</td><td>${p.status}</td><td>${p.lead}</td><td>${p.techStack.join(", ")}</td></tr>`,
    )
    .join("");

  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Projects (SSR) — TeamHub</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background: #f0f0f0; }
  </style>
</head>
<body>
  <nav><a href="/">Home</a></nav>
  <h1>Projects (SSR)</h1>
  <table>
    <tr><th>Name</th><th>Status</th><th>Lead</th><th>Tech Stack</th></tr>
    ${rows}
  </table>
</body>
</html>`);
});

// SSG — served as static file from public/projects-static.html

app.get("/projects/:id", (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.send(projectDetailPage(project));
});

app.get("/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.get("/people", (req, res) => {
  res.redirect(301, "/team");
});

app.get("/set-theme", (req, res) => {
  res.cookie("theme", "light", { path: "/", httpOnly: true });
  res.json({ ok: true });
});

app.get("/api/projects", (req, res) => {
  res.json(projects);
});

app.get("/api/projects/:id", (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

app.get("/api/articles", (req, res) => {
  res.json(articles);
});

app.get("/api/articles/:id", (req, res) => {
  const article = articles.find((a) => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: "Article not found" });
  res.json(article);
});

app.get("/api/team", (req, res) => {
  res.json(team);
});

app.use((req, res) => {
  res.status(404).send("<h1>404 — Page not found</h1>");
});

const server = app.listen(4000, () => {
  console.log("TeamHub running on http://localhost:4000");
});

server.on("error", (err) => {
  console.error("Failed to start:", err.message);
});
