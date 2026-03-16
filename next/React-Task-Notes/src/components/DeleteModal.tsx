interface DeleteModalProps {
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ taskTitle, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Delete Task</h3>
        <p>Are you sure you want to delete "{taskTitle}"?</p>
        <div className="actions">
          <button className="secondary" onClick={onCancel}>Cancel</button>
          <button className="danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
