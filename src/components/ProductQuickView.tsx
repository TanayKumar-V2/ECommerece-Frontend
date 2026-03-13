"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Check, ChevronRight, ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import { useStore, Product } from '@/store/useStore'

interface ProductQuickViewProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
    const { addToCart } = useStore();
    
    // Use product options or fallbacks
    const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'];
    const colors = product.colors && product.colors.length > 0 ? product.colors : ['Black'];
    const images = Array.isArray(product.image) ? product.image : [product.image || "/placeholder.jpg"];


    const [selectedSize, setSelectedSize] = useState(sizes[0]);
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart({
            ...product,
            image: images[currentImageIndex], // Use selected/current image representation if needed
            quantity,
            size: selectedSize,
            color: selectedColor
        });
        
        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            onClose();
        }, 1500);
    };

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row pointer-events-auto border border-brand-beige/20 relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 p-2 bg-white/50 backdrop-blur-md rounded-full hover:bg-brand-cream transition-colors text-foreground/60 hover:text-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Left: Image Gallery */}
                            <div className="w-full md:w-1/2 bg-brand-cream/30 relative min-h-[250px] sm:min-h-[300px] md:min-h-full shrink-0">
                                <Image
                                    src={images[currentImageIndex] || "/placeholder.jpg"}
                                    alt={product.name || "Product"}
                                    fill
                                    className="object-cover"
                                />
                                {images.length > 1 && (
                                    <>
                                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/50 backdrop-blur-md rounded-full hover:bg-white text-foreground transition-all">
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/50 backdrop-blur-md rounded-full hover:bg-white text-foreground transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Right: Product Details */}
                            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto">
                                <p className="text-[10px] uppercase tracking-widest text-brand-beige font-semibold mb-2">{product.category}</p>
                                <h2 className="text-2xl md:text-3xl font-heading mb-2 leading-tight">{product.name}</h2>
                                <p className="text-2xl font-bold mb-8">₹{product.price.toLocaleString('en-IN')}</p>

                                <div className="space-y-6 flex-1">
                                    {/* Color Selection */}
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-medium uppercase tracking-wider text-foreground/80">Color</span>
                                            <span className="text-sm text-foreground/50">{selectedColor}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {colors.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`px-4 py-2 text-sm border rounded-lg transition-all ${selectedColor === color ? 'border-foreground bg-foreground text-white shadow-md' : 'border-brand-beige/50 text-foreground/70 hover:border-foreground/50'}`}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Size Selection */}
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-medium uppercase tracking-wider text-foreground/80">Size</span>
                                            <span className="text-sm text-foreground/50">{selectedSize}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`w-12 h-12 flex items-center justify-center border rounded-xl font-medium transition-all ${selectedSize === size ? 'border-foreground bg-foreground text-background shadow-md' : 'border-brand-beige/50 text-foreground/70 hover:border-foreground/50'}`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <span className="text-sm font-medium uppercase tracking-wider text-foreground/80 block mb-3">Quantity</span>
                                        <div className="flex items-center gap-4 border border-brand-beige/50 rounded-xl px-4 py-1.5 w-max">
                                            <button 
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="text-foreground/60 hover:text-foreground p-1 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-medium">{quantity}</span>
                                            <button 
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="text-foreground/60 hover:text-foreground p-1 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-8 md:mt-10 pt-6 border-t border-brand-beige/20 flex gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={added}
                                        className={`flex-1 py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${added ? 'bg-green-600 text-white shadow-lg' : 'bg-foreground text-background hover:bg-foreground/90 hover:shadow-lg'}`}
                                    >
                                        {added ? (
                                            <><Check className="w-5 h-5" /> Added to Cart</>
                                        ) : (
                                            <><ShoppingCart className="w-5 h-5" /> Add {quantity} items - ₹{(product.price * quantity).toLocaleString('en-IN')}</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
