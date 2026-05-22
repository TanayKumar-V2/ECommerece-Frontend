"use client"

import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, FormEvent } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-brand-cream/20 flex flex-col relative overflow-hidden">
      <Navbar />

      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <motion.div
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 -left-20 w-96 h-96 bg-brand-cream rounded-full blur-3xl opacity-60"
        />
        <motion.div
          animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 right-10 w-96 h-96 bg-brand-beige rounded-full blur-3xl opacity-30"
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 mt-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-xl border border-foreground/5"
        >
          {!success ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-medium mb-2">Forgot Password</h1>
                <p className="text-foreground/60 text-sm">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 pl-1">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full px-5 py-4 bg-brand-cream/10 border border-brand-beige/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-beige focus:border-transparent transition-all placeholder:text-foreground/30"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center px-1">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-foreground text-background py-4 rounded-2xl font-medium hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform tracking-wide mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isLoading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-foreground/60">
                Remember your password?{' '}
                <Link href="/login" className="font-semibold text-foreground hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-heading font-medium mb-3">Check Your Email</h2>
              <p className="text-foreground/60 text-sm leading-relaxed">
                If an account with that email exists, we&apos;ve sent a password reset link.
                <br />
                Please check your inbox and follow the instructions.
              </p>
              <Link
                href="/login"
                className="inline-block mt-8 text-sm font-semibold text-foreground hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
