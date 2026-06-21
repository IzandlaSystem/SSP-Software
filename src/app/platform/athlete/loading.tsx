export default function AthleteLoading() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="h-8 w-60 rounded-lg bg-zinc-200 loading-skeleton" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="h-36 rounded-lg bg-zinc-100 loading-skeleton" />
        <div className="h-36 rounded-lg bg-zinc-100 loading-skeleton" />
        <div className="h-36 rounded-lg bg-zinc-100 loading-skeleton" />
      </div>
      <div className="h-72 rounded-lg bg-zinc-100 loading-skeleton" />
    </div>
  );
}
