// drill 4 - error boundary with retry
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("tasks error:", error.message);
  }, [error]);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold text-red-700 mb-2">
          Something went wrong
        </h2>
        <p className="text-red-600 mb-6">
          There was a problem loading your tasks. This might be a network issue
          or the server may be down.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={reset}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
