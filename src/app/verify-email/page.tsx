"use client"

import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMsg('Missing verification token.')
      return
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setStatus('success')
          setTimeout(() => router.push('/login?verified=true'), 2000)
        } else {
          setStatus('error')
          setErrorMsg(data.error || 'Verification failed')
        }
      })
      .catch(() => {
        setStatus('error')
        setErrorMsg('Something went wrong.')
      })
  }, [token, router])

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
          className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-xl border border-foreground/5 text-center"
        >
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg className="w-8 h-8 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h1 className="text-2xl font-heading font-medium mb-3">Verifying your email…</h1>
              <p className="text-foreground/60 text-sm">Please wait a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-heading font-medium mb-3">Email Verified!</h1>
              <p className="text-foreground/60 text-sm leading-relaxed">
                Your email has been verified successfully.
                <br />
                Redirecting you to sign in…
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                </svg>
              </div>
              <h1 className="text-2xl font-heading font-medium mb-3">Verification Failed</h1>
              <p className="text-foreground/60 text-sm leading-relaxed mb-6">{errorMsg}</p>
              <Link
                href="/login"
                className="text-sm font-semibold text-foreground hover:underline"
              >
                Back to Sign In
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </main>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-brand-cream/20 flex items-center justify-center">
        <p className="text-foreground/60">Loading…</p>
      </main>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
