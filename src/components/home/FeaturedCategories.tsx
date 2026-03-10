"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
    {
        title: "Men's Clothing",
        image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800",
        link: "/men",
        span: "md:col-span-2 md:row-span-2",
    },
    {
        title: "Women's Clothing",
        image: "https://images.unsplash.com/photo-1550614000-4b95d4edfa23?auto=format&fit=crop&q=80&w=800",
        link: "/women",
        span: "md:col-span-2 md:row-span-2",
    },
    {
        title: "Oversized Tees",
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800",
        link: "/men?category=oversized",
        span: "md:col-span-1 md:row-span-1",
    },
    {
        title: "Slim Fit Tees",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
        link: "/men?category=slim",
        span: "md:col-span-1 md:row-span-1",
    },
    {
        title: "Printed Tees",
        image: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=800",
        link: "/women?category=printed",
        span: "md:col-span-2 md:row-span-1",
    }
]

export default function FeaturedCategories() {
    return (
        <section className="py-24 bg-background">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center md:text-left"
                >
                    <h2 className="text-3xl md:text-5xl font-heading font-medium tracking-tight mb-4">Curated Categories</h2>
                    <p className="text-foreground/70 max-w-2xl mx-auto md:mx-0">
                        Explore our meticulously crafted collections designed for exceptional comfort and timeless style.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`group relative overflow-hidden rounded-3xl ${category.span}`}
                        >
                            <Link href={category.link} className="block w-full h-full relative cursor-pointer">
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

                                {/* Glow Effect using ::after approach in tailwind */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)] pointer-events-none" />

                                <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    <h3 className="text-2xl font-heading text-white font-medium mb-2">{category.title}</h3>
                                    <div className="h-[2px] w-0 bg-white group-hover:w-16 transition-all duration-500 ease-out" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
