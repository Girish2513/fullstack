import { useState } from "react";
import type { Task } from "../types/task";
import { useTasks } from "../hooks/useTasks";
import TaskItem from "./TaskItem";
import AddTaskForm from "./AddTaskForm";
import DeleteModal from "./DeleteModal";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

type Filter = "all" | "active" | "completed";

export default function TaskList() {
  const { tasks, loading, error, fetchTasks, addTask, toggleTask, deleteTask } = useTasks();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const filtered = tasks.filter((task) => {
    if (filter === "active" && task.completed) return false;
    if (filter === "completed" && !task.completed) return false;
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;

  async function handleAdd(title: string) {
    await addTask({ title, user_id: 1 });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteTask(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <div>
      <AddTaskForm onAdd={handleAdd} />

      {error && <ErrorMessage message={error} onRetry={fetchTasks} />}

      <div className="stats">
        <span>Total: {total}</span>
        <span>Active: {active}</span>
        <span>Done: {completed}</span>
      </div>

      <div className="filter-bar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && filtered.length === 0 && (
        <div className="empty">
          {search ? "No tasks match your search." : "No tasks yet."}
        </div>
      )}

      {filtered.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={toggleTask}
          onDelete={setDeleteTarget}
        />
      ))}

      {deleteTarget && (
        <DeleteModal
          taskTitle={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
