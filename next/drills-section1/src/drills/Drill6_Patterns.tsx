import { useState, type ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <header className="header">
        <h2 style={{ margin: 0, fontSize: "1.2rem", color: "white", border: "none", padding: 0 }}>Book Manager</h2>
      </header>
      <div style={{ padding: 24, background: "white" }}>{children}</div>
      <footer className="footer">Built with React - Drill 6</footer>
    </div>
  );
}

function Modal({ title, message, onConfirm, onCancel }: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <button className="danger" onClick={onConfirm}>Confirm</button>
        <button className="secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return <div className="loading">{text}</div>;
}

function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="error">
      {message}
      {onRetry && <button onClick={onRetry} style={{ marginLeft: 12 }}>Retry</button>}
    </div>
  );
}

export default function Drill6() {
  const [showModal, setShowModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [deleted, setDeleted] = useState<string | null>(null);

  function handleDelete() {
    setShowModal(false);
    setDeleted("Clean Code");
  }

  function simulateLoading() {
    setShowLoading(true);
    setTimeout(() => setShowLoading(false), 2000);
  }

  return (
    <div className="drill-section">
      <h2>Drill 6: Component Patterns</h2>

      <Layout>
        <p>This content is wrapped in a Layout with header and footer.</p>

        <div style={{ marginTop: 16 }}>
          <button onClick={() => setShowModal(true)}>Delete Book</button>
          <button className="secondary" onClick={simulateLoading}>Simulate Loading</button>
          <button className="secondary" onClick={() => setShowError(!showError)}>Toggle Error</button>
        </div>

        {showLoading && <LoadingSpinner text="Fetching data..." />}
        {showError && <ErrorMessage message="Failed to load books" onRetry={() => setShowError(false)} />}
        {deleted && <p style={{ marginTop: 12, color: "green" }}>Deleted: {deleted}</p>}
      </Layout>

      {showModal && (
        <Modal
          title="Delete Book"
          message="Are you sure you want to delete 'Clean Code'?"
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
