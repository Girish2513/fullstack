import { cookies } from "next/headers";
import { team } from "../../../data";

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body;

  const user = team.find(
    (t) => t.username === username && t.password === password
  );

  if (!user) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("session", user.id, {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
  });

  return Response.json({ ok: true, name: user.name });
}
