// drill 1 - server action form
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { TaskForm } from "@/components/task-form";
import { createTask } from "@/lib/actions";

export default function NewTaskPage() {
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
          <CardTitle>Create New Task</CardTitle>
          <CardDescription>
            Add a new task to your list with priority and details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm action={createTask} submitLabel="Create Task" />
        </CardContent>
      </Card>
    </div>
  );
}
