import Link from "next/link";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { TaskSearch } from "@/components/task-search";
import sql, { initDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Tasks - Task Notes",
  description: "View and manage your tasks",
};

interface TaskRow {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
  created_at: string;
  updated_at: string;
}

export default async function TasksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await initDb();
  const rows = await sql`SELECT * FROM tasks WHERE user_id = ${user.userId} ORDER BY created_at DESC` as TaskRow[];

  const tasks = rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description || "",
    completed: r.completed,
    priority: r.priority as "low" | "medium" | "high",
    createdAt: String(r.created_at),
    updatedAt: String(r.updated_at),
  }));

  const completed = tasks.filter((t) => t.completed).length;

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">
            {completed}/{tasks.length} completed
          </Badge>
          <Link
            href="/tasks/new"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-1.5 text-sm font-medium hover:bg-primary/80"
          >
            Add Task
          </Link>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No tasks yet!</p>
          <Link href="/tasks/new" className="text-primary hover:underline">
            Create your first task
          </Link>
        </div>
      ) : (
        <TaskSearch tasks={tasks} />
      )}
    </div>
  );
}
