"use client"

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Instagram, Twitter, Facebook } from 'lucide-react'

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-brand-cream text-foreground pt-16 pb-8 border-t border-brand-beige/50"
        >
            <div className="container-custom grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 sm:col-span-2 md:col-span-2">
                    <Link href="/" className="mb-6 block relative w-fit">
                        <Image
                            src="/logo.png"
                            alt="Viraasat Logo"
                            width={300}
                            height={50}
                            className="h-10 w-auto object-contain"
                        />
                    </Link>
                    <p className="text-foreground/80 max-w-sm mb-6 text-sm leading-relaxed">
                        Wear your culture. Modern fashion rooted in tradition, bringing you cozy, premium clothing for everyday life.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-background/50 rounded-full hover:bg-brand-beige transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-2 bg-background/50 rounded-full hover:bg-brand-beige transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-2 bg-background/50 rounded-full hover:bg-brand-beige transition-colors">
                            <Facebook className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
                    <ul className="flex flex-col gap-3 text-sm text-foreground/80">
                        <li><Link href="/men" className="hover:text-brand-beige transition-colors hover:translate-x-1 inline-block transform duration-200">Men&apos;s Collection</Link></li>
                        <li><Link href="/women" className="hover:text-brand-beige transition-colors hover:translate-x-1 inline-block transform duration-200">Women&apos;s Collection</Link></li>
                        <li><Link href="/about" className="hover:text-brand-beige transition-colors hover:translate-x-1 inline-block transform duration-200">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-brand-beige transition-colors hover:translate-x-1 inline-block transform duration-200">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-heading font-semibold text-lg mb-4">Contact Us</h4>
                    <ul className="flex flex-col gap-3 text-sm text-foreground/80">
                        <li><a href="mailto:viraasat.store18@gmail.com" className="hover:text-brand-beige transition-colors">viraasat.store18@gmail.com</a></li>
                        <li>+91 98765 43210</li>
                        <li className="mt-2 text-xs">Mon - Fri, 10am - 6pm (IST)</li>
                    </ul>
                </div>
            </div>

            <div className="container-custom text-center border-t border-brand-beige/30 pt-8 text-xs text-foreground/60">
                <p>&copy; {new Date().getFullYear()} Viraasat. All rights reserved. Designed with Apple-style motion & minimal luxury aesthetics.</p>
            </div>
        </motion.footer>
    )
}
