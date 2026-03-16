import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskForm } from "@/components/task-form";
import { updateTask } from "@/lib/actions";
import sql, { initDb } from "@/lib/db";

interface EditTaskPageProps {
  params: Promise<{ id: string }>;
}

interface TaskRow {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;
  const taskId = Number(id);

  if (isNaN(taskId)) notFound();

  await initDb();
  const rows = await sql`SELECT * FROM tasks WHERE id = ${taskId}` as TaskRow[];
  if (rows.length === 0) notFound();

  const task = rows[0];
  const updateTaskWithId = updateTask.bind(null, taskId);

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <Link
        href={`/tasks/${taskId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to Task
      </Link>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
          <CardDescription>Update the task details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm
            action={updateTaskWithId}
            submitLabel="Update Task"
            defaultValues={{
              title: task.title,
              description: task.description || "",
              priority: task.priority as "low" | "medium" | "high",
              completed: task.completed,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
