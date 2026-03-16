import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "task-notes-dev-secret-key-change-in-production"
);

export async function verifyApiRequest(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: NextResponse.json({ error: "Authentication required" }, { status: 401 }), user: null };
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { error: null, user: { userId: payload.userId as number, email: payload.email as string } };
  } catch {
    return { error: NextResponse.json({ error: "Invalid or expired token" }, { status: 401 }), user: null };
  }
}
