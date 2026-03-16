import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { tasks as fallbackTasks } from "@/lib/data";
import { TaskForm } from "@/components/task-form";
import { updateTask } from "@/lib/actions";

interface EditTaskPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;
  const taskId = Number(id);

  if (isNaN(taskId)) notFound();

  let task;

  try {
    task = await api.getTask(taskId);
  } catch {
    const local = fallbackTasks.find((t) => t.id === taskId);
    if (!local) notFound();
    task = { ...local, updatedAt: local.createdAt };
  }

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
              description: task.description,
              priority: task.priority,
              completed: task.completed,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
