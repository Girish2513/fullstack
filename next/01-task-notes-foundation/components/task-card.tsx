import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Task } from "@/lib/types";

const priorityColors: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              {task.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              Created {task.createdAt}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
            <Badge variant={task.completed ? "default" : "outline"}>
              {task.completed ? "Completed" : "Pending"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-3">
        <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
        <div className="flex justify-end">
          <Link
            href={`/tasks/${task.id}`}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            View Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
