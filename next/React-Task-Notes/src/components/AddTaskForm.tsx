import { useState } from "react";

interface AddTaskFormProps {
  onAdd: (title: string) => Promise<void>;
}

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      setError("Title is required");
      return;
    }
    if (trimmed.length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await onAdd(trimmed);
      setTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add task");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="add-form">
      <h3>Add New Task</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError(""); }}
          placeholder="What needs to be done?"
          disabled={submitting}
        />
        {error && <div className="error-text">{error}</div>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Task"}
        </button>
      </form>
    </div>
  );
}
