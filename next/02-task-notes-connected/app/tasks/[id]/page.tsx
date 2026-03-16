import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { tasks as fallbackTasks } from "@/lib/data";
import { TaskActions } from "@/components/task-actions";

const priorityColors: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

interface TaskDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: TaskDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const task = await api.getTask(Number(id));
    return {
      title: `${task.title} - Task Notes`,
      description: task.description,
      openGraph: { title: task.title, description: task.description },
    };
  } catch {
    const task = fallbackTasks.find((t) => t.id === Number(id));
    if (!task) return { title: "Task Not Found - Task Notes" };
    return { title: `${task.title} - Task Notes`, description: task.description };
  }
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
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
            <p>Updated: {new Date(task.updatedAt ?? task.createdAt).toLocaleDateString("en-GB")}</p>
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
