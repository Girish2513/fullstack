import { writeFileSync } from "fs";
import { projects } from "./data.js";

const rows = projects.map(p =>
  `<tr><td>${p.name}</td><td>${p.status}</td><td>${p.lead}</td><td>${p.techStack.join(", ")}</td></tr>`
).join("");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Projects (SSG) — TeamHub</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background: #f0f0f0; }
  </style>
</head>
<body>
  <nav><a href="/">Home</a></nav>
  <h1>Projects (SSG)</h1>
  <table>
    <tr><th>Name</th><th>Status</th><th>Lead</th><th>Tech Stack</th></tr>
    ${rows}
  </table>
</body>
</html>`;

writeFileSync("public/projects-static.html", html);
console.log("Generated public/projects-static.html");
