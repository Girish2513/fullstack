import type { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (task: Task) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      <div className="task-info">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          Created: {new Date(task.created_at).toLocaleDateString()}
        </div>
      </div>
      <div className="task-actions">
        <button className="danger" onClick={() => onDelete(task)}>Delete</button>
      </div>
    </div>
  );
}
