export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-blue-50 border-b border-blue-100 px-8 py-3">
        <p className="text-sm text-blue-700">
          Manage your tasks - create, complete, and organize your work.
        </p>
      </div>
      {children}
    </div>
  );
}
