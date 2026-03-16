import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import sql, { initDb } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "task-notes-dev-secret-key-change-in-production"
);

interface UserRow {
  id: number;
  email: string;
  password: string;
}

async function createToken(userId: number, email: string) {
  return new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function POST(request: Request) {
  await initDb();
  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  if (action === "register") {
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const rows = await sql`INSERT INTO users (email, password) VALUES (${email}, ${password}) RETURNING id`;
    const token = await createToken(rows[0].id, email);

    return NextResponse.json({
      token,
      user: { id: rows[0].id, email },
    });
  }

  const users = await sql`SELECT * FROM users WHERE email = ${email}` as UserRow[];
  if (users.length === 0 || users[0].password !== password) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const user = users[0];
  const token = await createToken(user.id, user.email);
  return NextResponse.json({
    token,
    user: { id: user.id, email: user.email },
  });
}
