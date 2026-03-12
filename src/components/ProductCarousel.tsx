"use client"

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Product } from '@/store/useStore'
import ProductCard from './ProductCard'
import ProductQuickView from './ProductQuickView'

interface ProductCarouselProps {
    title: string
    subtitle?: string
    products: Product[]
}

export default function ProductCarousel({ title, subtitle, products }: ProductCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [isCartModalOpen, setIsCartModalOpen] = useState(false)

    // Scroll progress effects can be added here

    return (
        <section ref={containerRef} className="py-20 overflow-hidden relative">
            <div className="container-custom mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl font-heading mb-3">{title}</h2>
                    {subtitle && <p className="text-foreground/70 max-w-xl">{subtitle}</p>}
                </motion.div>
            </div>

            {/* Horizontal Scroll Area */}
            {/* Using standard web-native horizontal scrolling disguised with neat scrollbars,
          which allows native touch/trackpad swipe feels very "Apple". */}
            <div className="pl-4 md:pl-8 lg:pl-16 flex gap-6 overflow-x-auto pb-12 pt-4 snap-x snap-mandatory hide-scroll-bar will-change-scroll">
                {products.map((product, index) => (
                    <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-center shrink-0">
                        <ProductCard 
                            product={product} 
                            index={index} 
                            onOpenQuickView={(p) => {
                                setSelectedProduct(p)
                                setIsCartModalOpen(true)
                            }}
                        />
                    </div>
                ))}
                {/* Padding element for the end of carousel */}
                <div className="min-w-[4px] md:min-w-[32px] shrink-0" />
            </div>

            {/* Quick View Modal */}
            {selectedProduct && (
                <ProductQuickView 
                    product={selectedProduct} 
                    isOpen={isCartModalOpen} 
                    onClose={() => setIsCartModalOpen(false)} 
                />
            )}

            <style jsx global>{`
        .hide-scroll-bar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scroll-bar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </section>
    )
}
