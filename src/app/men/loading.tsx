export default function MenLoading() {
  return <div className="min-h-screen bg-background py-24 container-custom" role="status"><span className="sr-only">Loading men&apos;s collection</span><div className="h-12 w-72 animate-pulse rounded-xl bg-brand-cream/60" /><div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-brand-cream/40" />)}</div></div>
}
