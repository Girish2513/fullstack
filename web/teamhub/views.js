function layout(title, body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — TeamHub</title>
  <style>
    body { font-family: sans-serif; margin: 0; padding: 20px; }
    nav { display: flex; gap: 16px; margin-bottom: 20px; }
    nav a { color: #0066cc; }
    h1 { margin-top: 0; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background: #f0f0f0; }
    ul { padding-left: 20px; }
    li { margin-bottom: 8px; }
    .stats { display: flex; gap: 16px; }
    .card { border: 1px solid #ccc; padding: 16px; border-radius: 4px; }
    .card h2 { margin: 0; }
    .card p { margin: 4px 0 0; color: #666; }
    a { color: #0066cc; }
  </style>
</head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="/projects">Projects</a>
    <a href="/articles">Articles</a>
    <a href="/team">Team</a>
  </nav>
  ${body}
</body>
</html>`;
}

export function homePage(projects, articles, team) {
  return layout("Home", `
  <h1>TeamHub</h1>
  <div class="stats">
    <div class="card">
      <h2 id="project-count">${projects.length}</h2>
      <p>Projects</p>
    </div>
    <div class="card">
      <h2>${articles.length}</h2>
      <p>Articles</p>
    </div>
    <div class="card">
      <h2>${team.length}</h2>
      <p>Team Members</p>
    </div>
  </div>
  <script>
    fetch("/api/projects")
      .then(res => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(data => {
        document.getElementById("project-count").textContent = data.length;
      })
      .catch(() => {
        document.getElementById("project-count").textContent = "!";
      });
  </script>`);
}

export function projectsPage(projects) {
  const rows = projects.map(p =>
    `<tr>
      <td><a href="/projects/${p.id}">${p.name}</a></td>
      <td>${p.status}</td>
      <td>${p.lead}</td>
      <td>${p.techStack.join(", ")}</td>
    </tr>`).join("");

  return layout("Projects", `
  <h1>Projects</h1>
  <table>
    <tr><th>Name</th><th>Status</th><th>Lead</th><th>Tech Stack</th></tr>
    ${rows}
  </table>`);
}

export function projectDetailPage(project) {
  return layout(project.name, `
  <h1>${project.name}</h1>
  <p><strong>Status:</strong> ${project.status}</p>
  <p><strong>Lead:</strong> ${project.lead}</p>
  <p><strong>Tech:</strong> ${project.techStack.join(", ")}</p>`);
}

export function articlesPage(articles) {
  const list = articles.map(a =>
    `<li>
      <a href="/articles/${a.id}">${a.title}</a>
      <br><small>By ${a.author} · ${a.date}</small>
    </li>`
  ).join("");

  return layout("Articles", `
  <h1>Articles</h1>
  <ul>${list}</ul>`);
}

export function articleDetailPage(article) {
  return layout(article.title, `
  <h1>${article.title}</h1>
  <p><small>By ${article.author} · ${article.date}</small></p>
  <p>${article.body}</p>`);
}

export function teamPage(team) {
  const cards = team.map(t =>
    `<div class="card">
      <h2>${t.name}</h2>
      <p>${t.role} · ${t.department}</p>
      <p>${t.email}</p>
    </div>`
  ).join("");

  return layout("Team", `
  <h1>Team</h1>
  <div class="stats">${cards}</div>`);
}
