"use client"

import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-xl border border-foreground/5 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
          </svg>
        </div>
        <h1 className="text-xl font-heading font-medium mb-3">Dashboard Error</h1>
        <p className="text-foreground/60 text-sm leading-relaxed mb-8">
          Something went wrong loading this page. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-foreground text-background px-8 py-4 rounded-2xl font-medium hover:bg-foreground/90 transition-all shadow-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
