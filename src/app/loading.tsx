export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-white text-zinc-950">
      <div className="h-2 w-28 overflow-hidden rounded-full bg-zinc-200">
        <div className="h-full w-1/2 rounded-full bg-[#2563EB] loading-bar" />
      </div>
    </div>
  );
}
