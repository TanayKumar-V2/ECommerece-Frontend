"use client"

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import { Product } from '@/store/useStore'
import ProductCard from './ProductCard'
import ProductQuickView from './ProductQuickView'

interface ProductGridProps {
    products: Product[]
    title: string
    description?: string
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const PRICE_RANGES = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 – ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
    { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: 999999 },
]

function ProductGridInner({ products, title, description }: ProductGridProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [isCartModalOpen, setIsCartModalOpen] = useState(false)

    const activeSize = searchParams.get('size') ?? ''
    const activeSort = searchParams.get('sort') ?? ''
    const activeMinPrice = searchParams.get('minPrice') ?? ''
    const activeMaxPrice = searchParams.get('maxPrice') ?? ''

    const buildUrl = (updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString())
        for (const [key, value] of Object.entries(updates)) {
            if (value) {
                params.set(key, value)
            } else {
                params.delete(key)
            }
        }
        return `${pathname}?${params.toString()}`
    }

    const handleSize = (size: string) => {
        router.replace(buildUrl({ size: activeSize === size ? '' : size }), { scroll: false })
    }

    const handleSort = (sort: string) => {
        router.replace(buildUrl({ sort: activeSort === sort ? '' : sort }), { scroll: false })
    }

    const handlePriceRange = (min: number, max: number) => {
        const isActive = activeMinPrice === String(min) && activeMaxPrice === String(max)
        if (isActive) {
            router.replace(buildUrl({ minPrice: '', maxPrice: '' }), { scroll: false })
        } else {
            router.replace(buildUrl({ minPrice: String(min), maxPrice: String(max) }), { scroll: false })
        }
    }

    const clearAll = () => {
        router.replace(pathname, { scroll: false })
    }

    const hasFilters = activeSize || activeSort || activeMinPrice || activeMaxPrice

    const SidebarContent = () => (
        <div className="sticky top-24 pr-4 border-r border-foreground/10 h-[calc(100vh-120px)] overflow-y-auto pb-10" style={{ scrollbarWidth: 'none' }}>
            {/* Filters Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-foreground font-heading font-semibold text-base">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                </div>
                {hasFilters && (
                    <button
                        onClick={clearAll}
                        className="text-xs text-foreground/40 hover:text-foreground underline underline-offset-2 transition-colors flex items-center gap-1"
                    >
                        <X className="w-3 h-3" /> Clear all
                    </button>
                )}
            </div>

            {/* Sort */}
            <div className="mb-8">
                <h3 className="font-heading font-semibold text-sm mb-3 uppercase tracking-widest text-foreground/60">Sort By</h3>
                <div className="space-y-2 text-sm">
                    {[
                        { label: 'Default', value: '' },
                        { label: 'Price: Low to High', value: 'asc' },
                        { label: 'Price: High to Low', value: 'desc' },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => handleSort(opt.value)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                                activeSort === opt.value
                                    ? 'bg-foreground text-background font-medium'
                                    : 'text-foreground/70 hover:bg-brand-cream/50 hover:text-foreground'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Size Filter */}
            <div className="mb-8">
                <h3 className="font-heading font-semibold text-sm mb-3 uppercase tracking-widest text-foreground/60">Size</h3>
                <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                        <button
                            key={size}
                            onClick={() => handleSize(size)}
                            className={`w-10 h-10 border rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                                activeSize === size
                                    ? 'bg-foreground text-background border-foreground shadow-sm'
                                    : 'border-foreground/20 text-foreground/70 hover:border-foreground hover:bg-foreground/5'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
                <h3 className="font-heading font-semibold text-sm mb-3 uppercase tracking-widest text-foreground/60">Price Range</h3>
                <div className="space-y-2">
                    {PRICE_RANGES.map((range) => {
                        const isActive = activeMinPrice === String(range.min) && activeMaxPrice === String(range.max)
                        return (
                            <button
                                key={range.label}
                                onClick={() => handlePriceRange(range.min, range.max)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                                    isActive
                                        ? 'bg-foreground text-background font-medium'
                                        : 'text-foreground/70 hover:bg-brand-cream/50 hover:text-foreground'
                                }`}
                            >
                                {range.label}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )

    return (
        <div className="py-24 bg-background min-h-screen">
            <div className="container-custom">
                {/* Header */}
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

                    {/* Mobile filter toggle */}
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="flex items-center gap-2 px-4 py-2 border border-foreground/20 rounded-full hover:bg-brand-cream/50 transition-colors md:hidden text-sm self-start"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        {hasFilters ? 'Filters (active)' : 'Filters'}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar – desktop always visible, mobile toggled */}
                    <motion.aside
                        initial={false}
                        animate={{
                            height: showMobileFilters ? 'auto' : undefined,
                            opacity: showMobileFilters ? 1 : undefined,
                        }}
                        className="md:w-60 shrink-0 md:block"
                        style={{
                            display: typeof window !== 'undefined' && window.innerWidth < 768 && !showMobileFilters ? 'none' : undefined,
                        }}
                    >
                        {/* Mobile: show inline panel */}
                        <div className="md:hidden mb-6 bg-white rounded-2xl p-4 border border-foreground/10 shadow-sm">
                            <SidebarContent />
                        </div>
                        {/* Desktop: sticky sidebar */}
                        <div className="hidden md:block">
                            <SidebarContent />
                        </div>
                    </motion.aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {products.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={index % 6}
                                    onOpenQuickView={(p) => {
                                        setSelectedProduct(p)
                                        setIsCartModalOpen(true)
                                    }}
                                />
                            ))}
                        </div>
                        {products.length === 0 && (
                            <div className="py-20 text-center text-foreground/50">
                                <p>No products found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick View Modal */}
            {selectedProduct && (
                <ProductQuickView
                    product={selectedProduct}
                    isOpen={isCartModalOpen}
                    onClose={() => setIsCartModalOpen(false)}
                />
            )}
        </div>
    )
}

export default function ProductGrid(props: ProductGridProps) {
    return (
        <Suspense fallback={<div className="py-24 min-h-screen bg-background" />}>
            <ProductGridInner {...props} />
        </Suspense>
    )
}
