"use client"

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
    return (
        <section className="relative min-h-[100svh] md:h-screen flex items-center justify-center overflow-hidden bg-brand-cream/20 py-20 md:py-0">
            {/* Background Decor */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.div
                    animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-40 -right-40 w-96 h-96 bg-brand-cream rounded-full blur-3xl opacity-50"
                />
                <motion.div
                    animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-beige rounded-full blur-3xl opacity-40"
                />
            </div>

            <div className="container-custom relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Text Content */}
                <div className="flex flex-col gap-4 md:gap-6 order-2 md:order-1 mt-6 md:mt-0">
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-medium tracking-tight leading-[1.1]"
                    >
                        Wear Your <br className="hidden md:block" />
                        <span className="italic text-brand-beige font-serif">Culture</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                        className="text-base sm:text-lg md:text-xl text-foreground/80 max-w-md font-light"
                    >
                        Modern fashion rooted in tradition. Cozy, premium, and minimal aesthetics for the everyday you.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                        className="mt-4"
                    >
                        <button className="px-8 py-3.5 md:py-4 bg-foreground text-background font-medium tracking-wide rounded-full hover:bg-foreground/80 transition-all hover:shadow-xl hover:-translate-y-1 transform duration-300 text-sm md:text-base">
                            Explore Collection
                        </button>
                    </motion.div>
                </div>

                {/* Hero Image */}
                <div className="order-1 md:order-2 relative w-full aspect-[4/5] max-w-[320px] sm:max-w-lg mx-auto md:ml-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="w-full h-full relative rounded-t-[80px] sm:rounded-t-[100px] rounded-b-[30px] sm:rounded-b-[40px] overflow-hidden shadow-2xl"
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full h-full relative"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=1200"
                                alt="Viraasat Hero Fashion"
                                fill
                                priority
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator - Hidden on very small heights to prevent overlap */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-foreground/50 z-20"
            >
                <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ArrowDown className="w-4 h-4" />
                </motion.div>
            </motion.div>
        </section>
    )
}
