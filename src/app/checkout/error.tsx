"use client"

import { useEffect } from 'react'
import Link from 'next/link'

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Checkout error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-brand-cream/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-xl border border-foreground/5 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-heading font-medium mb-3">Checkout Error</h1>
        <p className="text-foreground/60 text-sm leading-relaxed mb-8">
          Something went wrong during checkout. Your cart is safe — no payment has been charged.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full bg-foreground text-background py-4 rounded-2xl font-medium hover:bg-foreground/90 transition-all shadow-lg"
          >
            Try Again
          </button>
          <Link
            href="/cart"
            className="w-full bg-white border border-brand-beige/50 text-foreground py-4 rounded-2xl font-medium hover:bg-brand-cream/20 transition-all"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  )
}
