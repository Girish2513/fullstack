import Link from "next/link";

interface CategoriesPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { slug } = await params;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline text-sm">
        Back to Home
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-4">Categories</h1>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-slate-600 mb-3">
          URL segments captured: <strong>{slug.length}</strong>
        </p>
        <div className="space-y-2">
          {slug.map((segment, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="bg-slate-100 px-2 py-1 rounded font-mono">
                [{i}]
              </span>
              <span>{segment}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Full path: /categories/{slug.join("/")}
        </p>
      </div>
    </div>
  );
}
