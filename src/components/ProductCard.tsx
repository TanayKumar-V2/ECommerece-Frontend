"use client"

import { Product, useStore } from '@/store/useStore'
import { Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import ProductQuickView from './ProductQuickView'

interface ProductCardProps {
    product: Product
    index?: number
    onOpenQuickView?: (product: Product) => void
}

export default function ProductCard({ product, index = 0, onOpenQuickView }: ProductCardProps) {
    const toggleWishlist = useStore(state => state.toggleWishlist)
    const isWished = useStore(state => state.wishlist.some(w => w.id === product.id))
    const addRecentlyViewed = useStore(state => state.addRecentlyViewed)
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const displayWished = mounted ? isWished : false

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
                onClick={() => {
                    addRecentlyViewed(product)
                    onOpenQuickView?.(product)
                }}
            >
                <Link href={`/product/${product.id}`} onClick={(event) => event.stopPropagation()} className="absolute inset-0 focus-visible:z-20" aria-label={`View ${product.name || 'product'} details`}>
                    <Image
                        src={product.image || "/placeholder.jpg"}
                        alt={product.name || "Product"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                </Link>

                {/* Wishlist Button */}
                <button
                    type="button"
                    aria-label={displayWished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                    onClick={(e) => {
                        e.stopPropagation()
                        toggleWishlist(product)
                    }}
                    className="absolute top-3 right-3 p-2 min-w-11 min-h-11 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full sm:opacity-100 sm:translate-y-0 group-hover:bg-white transition-all duration-300 z-10 shadow-sm"
                >
                    <motion.div whileTap={{ scale: 0.8 }}>
                        <Heart className={`w-5 h-5 transition-colors ${displayWished ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
                    </motion.div>
                </button>

                {/* Add to Cart Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100 transition-all duration-300 flex justify-center z-10">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onOpenQuickView?.(product)
                        }}
                        type="button"
                        className="w-full bg-foreground text-background py-3 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-foreground/90 transition-colors shadow-lg"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Quick Add
                    </button>
                </div>
            </div>

            <div className="p-5 flex flex-col gap-1">
                <p className="text-xs text-foreground/60 uppercase tracking-wider">{product.category}</p>
                <Link href={`/product/${product.id}`} className="text-left font-heading text-lg font-medium text-foreground line-clamp-1 hover:underline underline-offset-4 focus-visible:underline">{product.name}</Link>
                <p className="text-foreground/80">₹{product.price.toLocaleString('en-IN')}</p>
                {product.stock === 0 ? <p className="text-xs font-medium text-error">Out of stock</p> : product.stock !== undefined && product.stock <= 5 ? <p className="text-xs font-medium text-warning">Only {product.stock} left</p> : null}
            </div>
        </motion.div>
    )
}
