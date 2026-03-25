"use client";

import { useState } from "react";
import Link from "next/link";

type Project = {
  id: string;
  name: string;
  status: string;
  lead: string;
  techStack: string[];
};

export default function ProjectSearch({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");

  console.log("rendered in browser");

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search projects..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Lead</th>
            <th>Tech Stack</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id}>
              <td>
                <Link href={`/projects/${p.id}`}>{p.name}</Link>
              </td>
              <td>{p.status}</td>
              <td>{p.lead}</td>
              <td>{p.techStack.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
