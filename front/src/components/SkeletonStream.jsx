export default function SkeletonStream() {
  return (
    <div className="flex h-full w-full animate-pulse items-center justify-center bg-linear-to-br from-slate-800 to-slate-700">
      <div className="h-3/4 w-3/4 rounded-2xl border border-white/10 bg-white/10" />
    </div>
  );
}