"use client"

import { useStore, Product } from '@/store/useStore'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function WishlistPage() {
    const { wishlist, toggleWishlist, addToCart } = useStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const handleMoveToCart = (product: Product) => {
        addToCart({ ...product, quantity: 1, size: 'M' })
        toggleWishlist(product) // Remove from wishlist when moving to cart
    }

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 py-24 container-custom">
                <h1 className="text-4xl font-heading mb-10">Your Wishlist</h1>

                {!mounted ? (
                    <div className="h-40 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-foreground border-t-transparent animate-spin"></div>
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-brand-cream/50 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-heading mb-4">Your wishlist is empty</h2>
                        <p className="text-foreground/70 mb-8 max-w-md">Save items that you love here. Review them anytime and easily move them to your cart.</p>
                        <Link href="/" className="px-8 py-3 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {wishlist.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-foreground/5"
                                >
                                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-cream/30">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <button
                                            onClick={() => toggleWishlist(item)}
                                            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-red-50 text-foreground hover:text-red-500 transition-colors z-10"
                                            title="Remove from wishlist"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        {/* Size Selector placeholder since real Myntra forces size selection */}
                                        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-center z-10">
                                            <button
                                                onClick={() => handleMoveToCart(item)}
                                                className="w-full bg-brand-beige text-foreground py-3 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-brand-cream transition-colors shadow-lg"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                Move to Cart
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1">{item.category}</p>
                                        <h3 className="font-medium text-foreground line-clamp-1 mb-1">{item.name}</h3>
                                        <p className="font-semibold text-foreground/80">₹{item.price.toLocaleString('en-IN')}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    )
}
