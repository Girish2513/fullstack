import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-yellow-700 mb-2">
          Task not found
        </h2>
        <p className="text-yellow-600 mb-4">
          The task you are looking for does not exist or has been deleted.
        </p>
        <Link
          href="/tasks"
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Back to Tasks
        </Link>
      </div>
    </div>
  );
}
