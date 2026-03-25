"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserProfile {
  name: string;
  role: string;
  department: string;
  email: string;
  projects: { id: string; name: string; status: string }[];
}

export default function MePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div>
      <h1>My Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Department:</strong> {user.department}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <h2>My Projects</h2>
      {user.projects.length > 0 ? (
        <ul>
          {user.projects.map((p) => (
            <li key={p.id}>
              <Link href={`/projects/${p.id}`}>{p.name}</Link> — {p.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects assigned.</p>
      )}

      <button onClick={handleLogout} style={{ marginTop: 16 }}>
        Logout
      </button>
    </div>
  );
}
