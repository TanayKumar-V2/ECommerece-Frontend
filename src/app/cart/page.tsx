"use client"

import { useStore } from '@/store/useStore'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function CartPage() {
    const { cart, removeFromCart, updateCartQuantity } = useStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const subtotal = mounted ? cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0
    const shipping = subtotal > 2000 ? 0 : 150
    const total = subtotal + shipping

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 py-24 container-custom">
                <h1 className="text-4xl font-heading mb-10">Shopping Cart</h1>

                {!mounted ? (
                    <div className="h-40 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-foreground border-t-transparent animate-spin"></div>
                    </div>
                ) : cart.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-brand-cream/50 rounded-full flex items-center justify-center mb-6">
                            <ShoppingCart className="w-10 h-10 text-foreground/30" />
                        </div>
                        <h2 className="text-2xl font-heading mb-4">Your cart is feeling light</h2>
                        <p className="text-foreground/70 mb-8 max-w-md">There is nothing in your cart. Let&apos;s add some cozy fashion items.</p>
                        <Link href="/" className="px-8 py-3 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left: Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between border-b border-foreground/10 pb-4 mb-6 text-sm uppercase tracking-wider text-foreground/60 font-medium hidden md:flex">
                                <div className="w-3/5">Product</div>
                                <div className="w-1/5 text-center">Quantity</div>
                                <div className="w-1/5 text-right">Total</div>
                            </div>

                            <div className="space-y-6">
                                <AnimatePresence>
                                    {cart.map((item) => (
                                        <motion.div
                                            key={`${item.id}-${item.size}`}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-foreground/5 relative"
                                        >
                                            <button
                                                onClick={() => removeFromCart(item.id, item.size)}
                                                className="absolute top-4 right-4 md:hidden text-foreground/40 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>

                                            <div className="flex gap-4 w-full md:w-3/5">
                                                <div className="relative w-24 h-32 rounded-xl overflow-hidden shrink-0 bg-brand-cream/30">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <p className="text-xs text-foreground/60 uppercase tracking-widest mb-1">{item.category}</p>
                                                    <h3 className="font-medium text-base mb-1 pr-6 md:pr-0">{item.name}</h3>
                                                    <p className="text-foreground/60 text-sm mb-2">Size: <span className="font-semibold text-foreground">{item.size}</span></p>
                                                    <p className="md:hidden font-semibold">₹{item.price.toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>

                                            <div className="w-full flex md:w-1/5 justify-between md:justify-center items-center mt-2 md:mt-0">
                                                <span className="md:hidden text-sm text-foreground/60">Quantity:</span>
                                                <div className="flex items-center gap-3 border border-foreground/20 rounded-full px-3 py-1">
                                                    <button
                                                        onClick={() => updateCartQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                                                        className="text-foreground/60 hover:text-foreground transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateCartQuantity(item.id, item.size, item.quantity + 1)}
                                                        className="text-foreground/60 hover:text-foreground transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="hidden md:flex flex-col items-end justify-center w-1/5 gap-2">
                                                <p className="font-semibold text-lg">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                                <button
                                                    onClick={() => removeFromCart(item.id, item.size)}
                                                    className="text-foreground/40 hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Remove
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right: Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-brand-cream/20 p-8 rounded-3xl sticky top-28 border border-brand-beige/30">
                                <h3 className="text-2xl font-heading mb-6">Order Summary</h3>

                                <div className="space-y-4 mb-6 text-foreground/80">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `₹${shipping}`}</span>
                                    </div>
                                    {shipping > 0 && (
                                        <p className="text-xs text-brand-beige text-right -mt-2">Free shipping on orders above ₹2,000</p>
                                    )}
                                </div>

                                <div className="border-t border-brand-beige py-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-lg">Total</span>
                                        <span className="font-bold text-2xl font-heading">₹{total.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <Link href="/checkout" className="w-full bg-foreground text-background py-4 flex items-center justify-center gap-2 rounded-xl font-medium hover:bg-foreground/90 transition-all hover:shadow-lg hover:-translate-y-1 transform duration-300">
                                    Proceed to Checkout <ArrowRight className="w-5 h-5" />
                                </Link>

                                <div className="mt-4 text-center">
                                    <Link href="/" className="text-sm text-foreground/60 hover:text-foreground transition-colors inline-block border-b border-transparent hover:border-foreground pb-0.5">
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    )
}
