"use client"

import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const router = useRouter()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || 'Something went wrong')
            } else {
                // Automatically sign in after registration
                const result = await signIn('credentials', {
                    redirect: false,
                    email: email.trim(),
                    password,
                })

                if (result?.error) {
                    // If auto-signin fails, redirect to login page
                    router.push('/login')
                } else {
                    router.push('/')
                    router.refresh()
                }
            }
        } catch (err: any) {
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-brand-cream/20 flex flex-col relative overflow-hidden">
            <Navbar />

            {/* Background Decor */}
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
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-heading font-medium mb-2">Create Account</h1>
                        <p className="text-foreground/60 text-sm">Join the Viraasat family today.</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground/80 pl-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full px-5 py-3.5 bg-brand-cream/10 border border-brand-beige/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-beige focus:border-transparent transition-all placeholder:text-foreground/30"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground/80 pl-1">Email</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full px-5 py-3.5 bg-brand-cream/10 border border-brand-beige/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-beige focus:border-transparent transition-all placeholder:text-foreground/30"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground/80 pl-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                disabled={isLoading}
                                className="w-full px-5 py-3.5 bg-brand-cream/10 border border-brand-beige/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-beige focus:border-transparent transition-all placeholder:text-foreground/30"
                            />
                            <p className="text-[10px] text-foreground/40 pl-1 italic">Must be at least 6 characters.</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <p className="text-red-500 text-sm text-center px-1 font-medium">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-foreground text-background py-4 rounded-2xl font-medium hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform tracking-wide mt-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {isLoading ? 'Creating account…' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-brand-beige/30"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-foreground/50">Or register with</span>
                            </div>
                        </div>

                        <button 
                            type="button"
                            onClick={() => signIn('google', { callbackUrl: '/' })}
                            disabled={isLoading}
                            className="mt-6 w-full bg-white border border-brand-beige/50 text-foreground py-4 rounded-2xl font-medium hover:bg-brand-cream/20 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.745 12.27C23.745 11.42 23.665 10.6 23.525 9.81H12.255V14.47H18.705C18.425 15.96 17.585 17.26 16.295 18.12V21.16H20.185C22.455 19.06 23.745 15.95 23.745 12.27Z" fill="#4285F4" />
                                <path d="M12.2549 24C15.4849 24 18.2049 22.93 20.1849 21.16L16.2949 18.12C15.2249 18.84 13.8449 19.27 12.2549 19.27C9.1749 19.27 6.5649 17.18 5.6149 14.39H1.6149V17.49C3.5749 21.37 7.5849 24 12.2549 24Z" fill="#34A853" />
                                <path d="M5.6149 14.39C5.3749 13.67 5.2349 12.89 5.2349 12.09C5.2349 11.29 5.3749 10.51 5.6149 9.79V6.69006H1.6149C0.8049 8.35006 0.3349 10.18 0.3349 12.09C0.3349 14.01 0.8049 15.84 1.6149 17.5L5.6149 14.39Z" fill="#FBBC05" />
                                <path d="M12.2549 4.88C14.0149 4.88 15.5849 5.49 16.8249 6.67L20.2649 3.23C18.1949 1.3 15.4849 0.17 12.2549 0.17C7.5849 0.17 3.5749 2.81 1.6149 6.69L5.6149 9.79C6.5649 7 9.1749 4.88 12.2549 4.88Z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-foreground/60">
                        Already have an account? <Link href="/login" className="font-semibold text-foreground hover:underline">Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </main>
    )
}
