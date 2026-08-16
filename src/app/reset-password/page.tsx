"use client"

import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, FormEvent, Suspense } from 'react'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
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

  if (!token) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
          </svg>
        </div>
        <h2 className="text-2xl font-heading font-medium mb-3">Invalid Link</h2>
        <p className="text-foreground/60 text-sm leading-relaxed mb-6">
          This reset link is missing or malformed.
        </p>
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-foreground hover:underline"
        >
          Request a new reset link
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-heading font-medium mb-3">Password Reset</h2>
        <p className="text-foreground/60 text-sm leading-relaxed mb-6">
          Your password has been updated successfully.
          <br />
          You can now sign in with your new password.
        </p>
        <Link
          href="/login"
          className="inline-block bg-foreground text-background px-8 py-4 rounded-2xl font-medium hover:bg-foreground/90 transition-all shadow-lg"
        >
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-medium mb-2">Reset Password</h1>
        <p className="text-foreground/60 text-sm">Enter your new password below.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="new-password" className="text-sm font-medium text-foreground/80 pl-1">New Password</label>
          <input
            type="password"
            id="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading}
            className="w-full px-5 py-4 bg-brand-cream/10 border border-brand-beige/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent transition-all placeholder:text-muted text-base"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm-password" className="text-sm font-medium text-foreground/80 pl-1">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-5 py-4 bg-brand-cream/10 border border-brand-beige/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent transition-all placeholder:text-muted text-base"
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
          {isLoading ? 'Resetting…' : 'Reset Password'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-foreground/60">
        Remember your password?{' '}
        <Link href="/login" className="font-semibold text-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </>
  )
}

export default function ResetPasswordPage() {
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
          <Suspense fallback={<div className="text-center py-8">Loading…</div>}>
            <ResetPasswordForm />
          </Suspense>
        </motion.div>
      </div>
    </main>
  )
}
