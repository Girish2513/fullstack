export default function Loading() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="animate-pulse">
        <div className="h-8 bg-slate-300 rounded mb-4 w-1/3"></div>
        <div className="space-y-3">
          <div className="h-16 bg-slate-200 rounded"></div>
          <div className="h-16 bg-slate-200 rounded"></div>
          <div className="h-16 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
