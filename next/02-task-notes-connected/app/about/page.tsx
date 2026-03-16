import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Task Notes",
  description: "About the Task Notes application",
};

export default function AboutPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">About</h1>
      <p className="text-slate-600 mb-4">
        Task Notes is a full-stack task management app built with Next.js and
        PostgreSQL. It supports creating, editing, completing, and deleting tasks.
      </p>
      <p className="text-slate-600 mb-6">
        Built as part of the Saana fullstack curriculum to learn Next.js routing,
        server components, and API integration.
      </p>
      <Link href="/" className="text-blue-600 hover:underline font-medium">
        Back to Home
      </Link>
    </div>
  );
}
