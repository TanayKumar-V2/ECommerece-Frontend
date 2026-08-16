export default function AdminLoading() {
  return (
    <div className="space-y-6" role="status" aria-live="polite">
      <span className="sr-only">Loading admin workspace</span>
      <div className="h-10 w-64 animate-pulse rounded-xl bg-brand-cream/60" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl bg-white border border-foreground/5" />)}
      </div>
      <div className="h-80 animate-pulse rounded-2xl bg-white border border-foreground/5" />
    </div>
  )
}
