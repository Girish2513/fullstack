import { NextResponse } from "next/server";
import sql, { initDb } from "@/lib/db";
import { verifyApiRequest } from "@/lib/api-auth";

interface TaskRow {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
  created_at: string;
  updated_at: string;
}

function formatTask(row: TaskRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    completed: row.completed,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error, user } = await verifyApiRequest(request);
  if (error) return error;

  await initDb();
  const { id } = await params;
  const rows = await sql`SELECT * FROM tasks WHERE id = ${Number(id)} AND user_id = ${user!.userId}` as TaskRow[];

  if (rows.length === 0) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(formatTask(rows[0]));
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error, user } = await verifyApiRequest(request);
  if (error) return error;

  await initDb();
  const { id } = await params;
  const taskId = Number(id);

  const existing = await sql`SELECT * FROM tasks WHERE id = ${taskId} AND user_id = ${user!.userId}` as TaskRow[];
  if (existing.length === 0) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const body = await request.json();
  const title = body.title ?? existing[0].title;
  const description = body.description ?? existing[0].description;
  const completed = body.completed !== undefined ? body.completed : existing[0].completed;
  const priority = body.priority ?? existing[0].priority;

  const updated = await sql`
    UPDATE tasks SET title = ${title}, description = ${description},
    completed = ${completed}, priority = ${priority}, updated_at = NOW()
    WHERE id = ${taskId} AND user_id = ${user!.userId}
    RETURNING *
  ` as TaskRow[];

  return NextResponse.json(formatTask(updated[0]));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error, user } = await verifyApiRequest(request);
  if (error) return error;

  await initDb();
  const { id } = await params;
  const result = await sql`DELETE FROM tasks WHERE id = ${Number(id)} AND user_id = ${user!.userId} RETURNING id`;

  if (result.length === 0) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
