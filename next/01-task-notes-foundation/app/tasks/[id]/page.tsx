import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TaskActions } from "@/components/task-actions";
import sql, { initDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const priorityColors: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

interface TaskDetailPageProps {
  params: Promise<{ id: string }>;
}

interface TaskRow {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
  created_at: string;
  updated_at: string;
}

async function getTask(id: number, userId: number) {
  await initDb();
  const rows = await sql`SELECT * FROM tasks WHERE id = ${id} AND user_id = ${userId}` as TaskRow[];
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    title: r.title,
    description: r.description || "",
    completed: r.completed,
    priority: r.priority,
    createdAt: String(r.created_at),
    updatedAt: String(r.updated_at),
  };
}

export async function generateMetadata({
  params,
}: TaskDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return { title: "Task Notes" };
  const task = await getTask(Number(id), user.userId);
  if (!task) return { title: "Task Not Found - Task Notes" };
  return {
    title: `${task.title} - Task Notes`,
    description: task.description,
    openGraph: { title: task.title, description: task.description },
  };
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const taskId = Number(id);

  if (isNaN(taskId)) notFound();

  const task = await getTask(taskId, user.userId);
  if (!task) notFound();

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <Link
        href="/tasks"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to Tasks
      </Link>

      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{task.title}</h1>
            <div className="flex gap-2">
              <Badge
                variant="secondary"
                className={priorityColors[task.priority]}
              >
                {task.priority}
              </Badge>
              <Badge variant={task.completed ? "default" : "outline"}>
                {task.completed ? "Completed" : "Pending"}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-4 space-y-3">
          <p className="text-muted-foreground">{task.description}</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Created: {new Date(task.createdAt).toLocaleDateString("en-GB")}</p>
            <p>Updated: {new Date(task.updatedAt).toLocaleDateString("en-GB")}</p>
            <p>ID: {task.id}</p>
          </div>
          <div className="flex gap-2 mt-4">
            <a
              href={`/tasks/${task.id}/edit`}
              className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-primary/80"
            >
              Edit Task
            </a>
          </div>
          <TaskActions task={{ id: task.id, title: task.title, completed: task.completed }} />
        </CardContent>
      </Card>
    </div>
  );
}
