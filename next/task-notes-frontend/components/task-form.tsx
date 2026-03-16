"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskFormProps {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  defaultValues?: {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    completed?: boolean;
  };
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="flex-1" disabled={pending}>
      {pending ? "Saving..." : label}
    </Button>
  );
}

export function TaskForm({ action, submitLabel, defaultValues = {} }: TaskFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [priority, setPriority] = useState<string>(
    defaultValues.priority || "medium"
  );

  const handleAction = async (formData: FormData) => {
    // shadcn Select doesn't write to FormData natively, inject it manually
    formData.set("priority", priority);

    const title = formData.get("title") as string;
    if (!title || title.trim().length < 3) {
      setErrors({ title: "Title must be at least 3 characters" });
      return;
    }

    setErrors({});

    try {
      await action(formData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrors({ general: msg });
    }
  };

  return (
    <form action={handleAction} className="space-y-6">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {errors.general}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter task title..."
          defaultValue={defaultValues.title}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Add task details..."
          defaultValue={defaultValues.description}
          className="min-h-[100px] resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Priority</Label>
        <Select value={priority} onValueChange={(v) => v && setPriority(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {defaultValues.completed !== undefined && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="completed"
            name="completed"
            defaultChecked={defaultValues.completed}
            className="rounded border-gray-300"
          />
          <Label htmlFor="completed">Mark as completed</Label>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <SubmitButton label={submitLabel} />
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
