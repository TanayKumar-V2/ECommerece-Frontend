"use client"

import { Product, useStore } from '@/store/useStore'
import { Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface ProductCardProps {
    product: Product
    index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    const { toggleWishlist, isInWishlist, addToCart, addRecentlyViewed } = useStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const isWished = mounted ? isInWishlist(product.id) : false

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
            <div
                className="relative aspect-[3/4] w-full overflow-hidden bg-brand-cream/30 cursor-pointer"
                onClick={() => addRecentlyViewed(product)}
            >
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        toggleWishlist(product)
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white z-10"
                >
                    <motion.div whileTap={{ scale: 0.8 }}>
                        <Heart className={`w-5 h-5 transition-colors ${isWished ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
                    </motion.div>
                </button>

                {/* Add to Cart Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-center z-10">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            addToCart({ ...product, quantity: 1, size: 'M' }) // Default size M for quick add
                        }}
                        className="w-full bg-foreground text-background py-3 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-foreground/90 transition-colors shadow-lg"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Quick Add
                    </button>
                </div>
            </div>

            <div className="p-5 flex flex-col gap-1">
                <p className="text-xs text-foreground/60 uppercase tracking-wider">{product.category}</p>
                <h3 className="font-heading text-lg font-medium text-foreground line-clamp-1">{product.name}</h3>
                <p className="text-foreground/80">₹{product.price.toLocaleString('en-IN')}</p>
            </div>
        </motion.div>
    )
}
