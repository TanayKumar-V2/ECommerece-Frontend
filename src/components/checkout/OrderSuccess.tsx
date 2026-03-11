"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Loader2, Check } from 'lucide-react'

export default function OrderSuccess({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState<'processing' | 'success'>('processing')

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setStep('success')
        }, 1500)

        const timer2 = setTimeout(() => {
            onComplete()
        }, 3500)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
        }
    }, [onComplete])

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2rem] p-10 max-w-sm w-full shadow-2xl border border-foreground/5 flex flex-col items-center justify-center min-h-[300px]"
            >
                {step === 'processing' ? (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="relative mb-6">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            >
                                <Loader2 className="w-12 h-12 text-brand-beige" />
                            </motion.div>
                        </div>
                        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">Processing your order</h3>
                        <p className="text-sm text-foreground/60 w-48 mx-auto">Please do not close this window or refresh the page.</p>
                        
                        <div className="w-full h-1 bg-brand-cream/50 rounded-full mt-6 overflow-hidden">
                            <motion.div 
                                className="h-full bg-brand-beige rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, ease: "linear" }}
                            />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="relative mb-6">
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [0, 1.1, 1], opacity: 1 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center relative"
                            >
                                <motion.svg
                                    className="absolute inset-0 w-full h-full"
                                    viewBox="0 0 80 80"
                                >
                                    <motion.circle
                                        cx="40" cy="40" r="38"
                                        className="stroke-emerald-500 fill-transparent"
                                        strokeWidth="4"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
                                    />
                                </motion.svg>
                                <motion.svg 
                                    className="w-10 h-10 text-emerald-600 z-10 relative" 
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.5 }}
                                >
                                    <motion.path 
                                        strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" 
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.4, delay: 0.6 }}
                                    />
                                </motion.svg>
                            </motion.div>
                        </div>
                        <motion.h3 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="text-2xl font-heading font-semibold text-foreground mb-2"
                        >
                            Order Confirmed 🎉
                        </motion.h3>
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="text-sm text-foreground/60 px-4"
                        >
                            Your Viraasat order has been placed successfully.
                        </motion.p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}
