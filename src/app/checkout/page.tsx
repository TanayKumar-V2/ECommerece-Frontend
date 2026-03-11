"use client"

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const InputField = ({ label, type = "text", placeholder }: { label: string, type?: string, placeholder?: string }) => (
    <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground/80">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            required
            className="px-4 py-3 bg-white border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige focus:border-transparent transition-all"
        />
    </div>
)

import { useRouter } from 'next/navigation'
import OrderSuccess from '@/components/checkout/OrderSuccess'
import PageTransition from '@/components/PageTransition'

export default function CheckoutPage() {
    const { cart } = useStore()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => setMounted(true), [])

    const subtotal = mounted ? cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0
    const shipping = subtotal > 2000 ? 0 : 150
    const total = subtotal + shipping

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)
    }

    const onAnimationComplete = () => {
        router.push('/checkout/success')
    }

    return (
        <PageTransition>
            <main className="min-h-screen bg-background flex flex-col relative">
            <Navbar />
            <div className="flex-1 py-24 container-custom max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-heading mb-10">Checkout</h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Shipping Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <form onSubmit={handlePayment} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-foreground/5 relative overflow-hidden">
                            <div>
                                <h3 className="text-xl font-heading mb-6 border-b border-foreground/10 pb-4">Contact Information</h3>
                                <InputField label="Email Address" type="email" placeholder="you@example.com" />
                            </div>

                            <div>
                                <h3 className="text-xl font-heading mb-6 border-b border-foreground/10 pb-4">Shipping Address</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="First Name" />
                                    <InputField label="Last Name" />
                                    <div className="col-span-2"><InputField label="Address" placeholder="123 Cozy Street" /></div>
                                    <InputField label="City" />
                                    <InputField label="State" />
                                    <InputField label="PIN Code" />
                                    <InputField label="Phone" type="tel" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-foreground text-background py-4 flex items-center justify-center gap-2 rounded-xl font-medium hover:bg-foreground/90 transition-all hover:shadow-lg hover:-translate-y-1 transform duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {isProcessing ? 'Processing...' : `Pay Rs. ${total.toLocaleString('en-IN')}`}
                            </button>
                        </form>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="order-first lg:order-last"
                    >
                        <div className="bg-brand-cream/20 p-6 md:p-8 rounded-3xl sticky top-28 border border-brand-beige/30">
                            <h3 className="text-xl font-heading mb-6">In your bag</h3>

                            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto hidden-scrollbar pr-2">
                                {!mounted ? null : cart.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                        <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-foreground/60 text-xs">Size: {item.size} • Qty: {item.quantity}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <p className="font-semibold text-sm w-max whitespace-nowrap">Rs. {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-brand-beige/40 text-sm text-foreground/80">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>Rs. {subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</span>
                                </div>
                            </div>

                            <div className="border-t border-brand-beige/40 py-4 mt-4">
                                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-foreground/5 shadow-sm">
                                    <span className="font-medium">Total</span>
                                    <span className="font-bold text-xl font-heading">Rs. {total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />

            <AnimatePresence>
                {isProcessing && <OrderSuccess onComplete={onAnimationComplete} />}
            </AnimatePresence>
        </main>
        </PageTransition>
    )
}
