export default function CoachLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="h-8 w-64 rounded-lg bg-zinc-200 loading-skeleton" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="h-32 rounded-lg bg-zinc-100 loading-skeleton" />
        <div className="h-32 rounded-lg bg-zinc-100 loading-skeleton" />
        <div className="h-32 rounded-lg bg-zinc-100 loading-skeleton" />
        <div className="h-32 rounded-lg bg-zinc-100 loading-skeleton" />
      </div>
      <div className="h-80 rounded-lg bg-zinc-100 loading-skeleton" />
    </div>
  );
}
