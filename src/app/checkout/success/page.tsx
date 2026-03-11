"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import Link from 'next/link'
import { Download, ArrowRight, Package, Check } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import PageTransition from '@/components/PageTransition'
import { useStore } from '@/store/useStore'
import { useRouter } from 'next/navigation'

export default function OrderSuccessPage() {
    const { cart } = useStore()
    const [mounted, setMounted] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [showToast, setShowToast] = useState(false)
    
    // Generate static order ID for demo
    const orderId = "VR-" + Math.floor(10000 + Math.random() * 90000)

    useEffect(() => {
        setMounted(true)
        
        // Fire confetti
        const duration = 2000
        const end = Date.now() + duration

        const frame = () => {
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#F5E6DA', '#EED9C4', '#D4B895']
            })
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#F5E6DA', '#EED9C4', '#D4B895']
            })

            if (Date.now() < end) {
                requestAnimationFrame(frame)
            }
        }
        frame()
    }, [])

    const router = useRouter()

    const handleDownload = () => {
        if (isDownloading) return
        setIsDownloading(true)
        
        // Add minimal shimmer effect before redirecting
        setTimeout(() => {
            router.push('/checkout/receipt')
        }, 1200)
    }

    if (!mounted) return null

    return (
        <PageTransition>
            <main className="min-h-screen bg-background flex flex-col relative overflow-hidden">
                <Navbar />
                <div className="flex-1 py-16 md:py-24 container-custom max-w-4xl relative z-10">
                    
                    {/* Hero Section */}
                    <div className="text-center mb-16 flex flex-col items-center">
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-24 h-24 bg-brand-cream/30 rounded-3xl flex items-center justify-center mb-8 shadow-sm"
                        >
                            <Package className="w-10 h-10 text-foreground/80" />
                        </motion.div>
                        
                        <div className="space-y-3">
                            <motion.h1 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl md:text-5xl font-heading"
                            >
                                Thank You For Your Order ❤️
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-foreground/70 text-lg max-w-lg mx-auto"
                            >
                                Your style journey with Viraasat begins now.
                            </motion.p>
                        </div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="mt-8 px-6 py-2.5 bg-brand-cream/20 border border-brand-beige/50 rounded-2xl relative overflow-hidden group"
                        >
                            <motion.div 
                                initial={{ left: '-100%' }}
                                animate={{ left: '200%' }}
                                transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                                className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-brand-beige/30 to-transparent skew-x-12"
                            />
                            <p className="text-sm font-medium text-foreground/80">Order ID: <span className="font-heading font-semibold text-foreground ml-1">{orderId}</span></p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
                        {/* Order Items */}
                        <div className="md:col-span-3">
                            <motion.h3 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg font-heading font-medium mb-6 border-b border-foreground/10 pb-4"
                            >
                                What's coming your way
                            </motion.h3>
                            <div className="space-y-4">
                                {cart.map((item, index) => (
                                    <motion.div 
                                        key={`${item.id}-${index}`}
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.4 + (index * 0.1), type: 'spring', stiffness: 100 }}
                                        className="flex gap-4 p-4 bg-white rounded-2xl border border-foreground/5 shadow-sm hover:shadow-md transition-shadow duration-300"
                                    >
                                        <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-brand-cream/30">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="font-medium text-foreground">{item.name}</h4>
                                            <p className="text-foreground/60 text-sm mt-1">Size: {item.size} • Qty: {item.quantity}</p>
                                        </div>
                                        <div className="flex items-center pr-2">
                                            <p className="font-heading font-semibold">Rs. {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="md:col-span-2 space-y-4 pt-1"
                        >
                            {/* Receipt Button */}
                            <motion.button 
                                onClick={handleDownload}
                                animate={isDownloading ? { scale: [1, 1.02, 1] } : {}}
                                transition={{ duration: 0.5 }}
                                className="w-full relative overflow-hidden bg-brand-cream/40 px-6 py-4 rounded-2xl flex items-center justify-between text-foreground hover:bg-brand-cream/60 transition-colors shadow-sm hover:shadow-md border border-brand-beige/20 group"
                            >
                                {isDownloading && (
                                    <motion.div 
                                        initial={{ left: '-100%' }}
                                        animate={{ left: '200%' }}
                                        transition={{ duration: 1, ease: "linear" }}
                                        className="absolute top-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 z-0"
                                    />
                                )}
                                <span className="font-medium font-heading z-10 relative">Download Receipt</span>
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm group-hover:-translate-y-0.5 transition-transform z-10 relative">
                                    <Download className="w-4 h-4" />
                                </div>
                            </motion.button>
                            
                            {/* Track Order Button */}
                            <button className="w-full bg-white px-6 py-4 rounded-2xl flex items-center justify-between text-foreground hover:bg-brand-cream/10 transition-colors shadow-sm border border-foreground/10 group">
                                <span className="font-medium font-heading">Track Order Flow</span>
                                <ArrowRight className="w-4 h-4 text-foreground/50 group-hover:translate-x-1 group-hover:text-foreground transition-all" />
                            </button>

                            <Link href="/" className="block w-full cursor-pointer mt-8">
                                <button className="w-full bg-foreground text-background py-4 rounded-2xl font-medium hover:bg-foreground/90 transition-all hover:-translate-y-0.5 shadow-md">
                                    Continue Shopping
                                </button>
                            </Link>

                        </motion.div>
                    </div>

                </div>
                <Footer />

                {/* Toast Notification */}
                <AnimatePresence>
                    {showToast && (
                        <motion.div 
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="fixed bottom-8 right-8 bg-foreground text-background px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 font-medium text-sm"
                        >
                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4" strokeWidth={3} />
                            </div>
                            Receipt downloaded successfully.
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </PageTransition>
    )
}
