"use client"

export default function MenError({ reset }: { reset: () => void }) {
  return <main className="min-h-screen bg-background flex items-center justify-center p-6"><div className="max-w-md text-center"><h1 className="text-3xl font-heading">Men&apos;s collection unavailable</h1><p className="mt-3 text-muted">We could not load these pieces. Please try again.</p><button type="button" onClick={reset} className="mt-6 rounded-full bg-foreground px-6 py-3 font-medium text-background">Try again</button></div></main>
}
