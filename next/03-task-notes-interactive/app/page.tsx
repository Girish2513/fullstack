import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">Task Notes App</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Welcome to your task management application. Manage your tasks, track
            progress, and stay organized.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/tasks"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/80"
            >
              View Tasks
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              About
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
