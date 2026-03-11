"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, ChevronDown } from 'lucide-react'
import { Product } from '@/store/useStore'
import ProductCard from './ProductCard'

interface ProductGridProps {
    products: Product[]
    title: string
    description?: string
}

export default function ProductGrid({ products, title, description }: ProductGridProps) {
    const [showFilters, setShowFilters] = useState(false)
    const [sortOption, setSortOption] = useState('popularity')

    // Basic mock sorting
    const sortedProducts = [...products].sort((a, b) => {
        if (sortOption === 'price-low') return a.price - b.price
        if (sortOption === 'price-high') return b.price - a.price
        return 0 // popularity/default
    })

    return (
        <div className="py-24 bg-background min-h-screen">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex-1"
                    >
                        <h1 className="text-4xl md:text-5xl font-heading mb-4">{title}</h1>
                        {description && <p className="text-foreground/70 max-w-2xl">{description}</p>}
                    </motion.div>

                    <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-foreground/10">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 border border-foreground/20 rounded-full hover:bg-brand-cream/50 transition-colors md:hidden text-sm"
                        >
                            <Filter className="w-4 h-4" /> Filters
                        </button>

                        <div className="relative group">
                            <button className="flex items-center gap-2 px-4 py-2 border border-foreground/20 rounded-full hover:bg-brand-cream/50 transition-colors text-sm">
                                Sort by: {sortOption === 'popularity' ? 'Popularity' : sortOption === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'} <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl rounded-xl border border-foreground/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden transform origin-top-right group-hover:scale-100 scale-95">
                                <button onClick={() => setSortOption('popularity')} className="block w-full text-left px-4 py-3 hover:bg-brand-cream/30 text-sm transition-colors">Popularity</button>
                                <button onClick={() => setSortOption('price-low')} className="block w-full text-left px-4 py-3 hover:bg-brand-cream/30 text-sm transition-colors">Price: Low to High</button>
                                <button onClick={() => setSortOption('price-high')} className="block w-full text-left px-4 py-3 hover:bg-brand-cream/30 text-sm transition-colors">Price: High to Low</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <motion.aside
                        initial={false}
                        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
                        className={`md:w-64 shrink-0 overflow-hidden md:!h-auto md:!opacity-100 uppercase tracking-wider text-sm`}
                    >
                        <div className="sticky top-24 pr-4 border-r border-foreground/10 h-[calc(100vh-120px)] overflow-y-auto hidden-scrollbar pb-10">
                            <div className="mb-8">
                                <h3 className="font-heading font-semibold text-base mb-4 tracking-normal">Categories</h3>
                                <ul className="space-y-3 text-foreground/70">
                                    <li className="cursor-pointer hover:text-brand-beige transition-colors flex items-center gap-2">
                                        <input type="checkbox" className="accent-foreground w-4 h-4 rounded-sm border-foreground/20" /> All {title}
                                    </li>
                                    <li className="cursor-pointer hover:text-brand-beige transition-colors flex items-center gap-2">
                                        <input type="checkbox" className="accent-foreground w-4 h-4 rounded-sm border-foreground/20" /> Oversized T-Shirts
                                    </li>
                                    <li className="cursor-pointer hover:text-brand-beige transition-colors flex items-center gap-2">
                                        <input type="checkbox" className="accent-foreground w-4 h-4 rounded-sm border-foreground/20" /> Slim Fit
                                    </li>
                                    <li className="cursor-pointer hover:text-brand-beige transition-colors flex items-center gap-2">
                                        <input type="checkbox" className="accent-foreground w-4 h-4 rounded-sm border-foreground/20" /> Printed
                                    </li>
                                    <li className="cursor-pointer hover:text-brand-beige transition-colors flex items-center gap-2">
                                        <input type="checkbox" className="accent-foreground w-4 h-4 rounded-sm border-foreground/20" /> Casual Wear
                                    </li>
                                </ul>
                            </div>

                            <div className="mb-8">
                                <h3 className="font-heading font-semibold text-base mb-4 tracking-normal">Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                        <button key={size} className="w-10 h-10 border border-foreground/20 rounded-full flex items-center justify-center hover:border-foreground transition-colors hover:bg-foreground hover:text-background">
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="font-heading font-semibold text-base mb-4 tracking-normal">Price Range</h3>
                                <input type="range" min="0" max="10000" className="w-full accent-foreground" />
                                <div className="flex justify-between mt-2 text-foreground/50">
                                    <span>₹0</span>
                                    <span>₹10,000+</span>
                                </div>
                            </div>
                        </div>
                    </motion.aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {sortedProducts.map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index % 6} />
                            ))}
                        </div>
                        {sortedProducts.length === 0 && (
                            <div className="py-20 text-center text-foreground/50">
                                <p>No products found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
