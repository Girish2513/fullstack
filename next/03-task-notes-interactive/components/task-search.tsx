"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { AnimatedTaskList } from "./animated-task-list";
import { Task } from "@/lib/types";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

interface TaskSearchProps {
  tasks: Task[];
}

export function TaskSearch({ tasks }: TaskSearchProps) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(tasks);
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcut("k", () => inputRef.current?.focus(), true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query.trim()) {
        setFiltered(tasks);
        return;
      }
      const lower = query.toLowerCase();
      setFiltered(
        tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(lower) ||
            t.description.toLowerCase().includes(lower) ||
            t.priority.includes(lower)
        )
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [query, tasks]);

  return (
    <div>
      <div className="mb-4 relative">
        <Input
          ref={inputRef}
          placeholder="Search tasks... (Ctrl+K)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-16"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
          >
            clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No tasks match &quot;{query}&quot;
        </p>
      ) : (
        <AnimatedTaskList tasks={filtered} />
      )}
    </div>
  );
}
