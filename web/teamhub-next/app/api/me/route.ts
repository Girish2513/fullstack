import { cookies } from "next/headers";
import { team, projects } from "../../../data";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = team.find((t) => t.id === session.value);
  if (!user) {
    return Response.json({ error: "Invalid session" }, { status: 401 });
  }

  const userProjects = projects.filter((p) => p.lead === user.name.split(" ")[0]);

  return Response.json({
    name: user.name,
    role: user.role,
    department: user.department,
    email: user.email,
    projects: userProjects,
  });
}
