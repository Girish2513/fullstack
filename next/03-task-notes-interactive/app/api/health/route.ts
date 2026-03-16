import { NextResponse } from "next/server";
import sql, { initDb } from "@/lib/db";

export async function GET() {
  try {
    await initDb();
    const result = await sql`SELECT COUNT(*) as count FROM tasks`;

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      tasks: Number(result[0].count),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
