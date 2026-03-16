"use client";

import { useState, useTransition } from "react";
import { toggleTaskCompletion, deleteTask } from "@/lib/actions";

interface TaskActionsProps {
  task: {
    id: number;
    title: string;
    completed: boolean;
  };
}

export function TaskActions({ task }: TaskActionsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTaskCompletion(task.id, !task.completed);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteTask(task.id);
      setShowDeleteModal(false);
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            task.completed
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              : "bg-green-100 text-green-800 hover:bg-green-200"
          } disabled:opacity-50`}
        >
          {isPending ? "Updating..." : task.completed ? "Mark Incomplete" : "Mark Complete"}
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          disabled={isPending}
          className="px-3 py-1.5 rounded text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50"
        >
          Delete
        </button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 max-w-sm mx-4 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Delete Task</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete &quot;{task.title}&quot;? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-muted text-foreground px-4 py-2 rounded hover:bg-muted/80"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
