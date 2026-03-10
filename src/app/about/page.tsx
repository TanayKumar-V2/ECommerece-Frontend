"use client"

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const yImage1 = useTransform(scrollYProgress, [0, 1], [0, -100])
    const yImage2 = useTransform(scrollYProgress, [0, 1], [0, 50])

    return (
        <main className="min-h-screen bg-background flex flex-col" ref={containerRef}>
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 overflow-hidden bg-brand-cream/10">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-5xl md:text-7xl font-heading mb-6 tracking-tight"
                        >
                            Our Story
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-lg md:text-2xl text-foreground/70 font-light leading-relaxed"
                        >
                            Viraasat is a modern clothing brand blending our rich culture with everyday fashion. We believe in crafting garments that tell a story while wrapping you in pure, cozy luxury.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Parallax Image Grid */}
            <section className="py-10 bg-brand-cream/10">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                        <motion.div
                            style={{ y: yImage1 }}
                            className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-xl md:-mt-20"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200"
                                alt="Viraasat Aesthetic"
                                fill
                                className="object-cover"
                            />
                        </motion.div>

                        <motion.div
                            style={{ y: yImage2 }}
                            className="relative w-full aspect-square md:aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl md:mt-20"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1558769132-cb1fac0840c2?auto=format&fit=crop&q=80&w=1200"
                                alt="Viraasat Details"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-24 bg-background">
                <div className="container-custom max-w-3xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl font-heading mb-8">Our Mission</h2>
                        <p className="text-lg text-foreground/80 leading-loose mb-12">
                            We started Viraasat with a simple idea: premium clothing doesn&apos;t have to be stiff or extravagant. It can be like a warm hug. It should celebrate timeless design, meticulous craftsmanship, and modern simplicity. By pairing minimal aesthetics with deep cultural roots, we create pieces you&apos;ll wear, love, and pass down.
                        </p>

                        <div className="inline-block p-8 bg-brand-cream/30 rounded-3xl border border-brand-beige/50">
                            <h3 className="font-heading text-xl mb-4">Get in Touch</h3>
                            <p className="text-foreground/70 mb-2">We&apos;d love to hear from you.</p>
                            <a href="mailto:viraasat.store18@gmail.com" className="text-lg font-medium hover:text-brand-beige transition-colors border-b border-foreground hover:border-brand-beige pb-1">
                                viraasat.store18@gmail.com
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
