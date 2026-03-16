import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-8 max-w-2xl mx-auto text-center mt-20">
      <h1 className="text-6xl font-bold text-slate-300 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">Page not found</h2>
      <p className="text-slate-500 mb-6">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="bg-slate-800 text-white px-6 py-2 rounded hover:bg-slate-700"
      >
        Go Home
      </Link>
    </div>
  );
}
