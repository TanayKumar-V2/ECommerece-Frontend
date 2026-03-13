"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Menu, User, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import SearchBar from './SearchBar'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const pathname = usePathname()
    const { data: session } = useSession()

    // To avoid hydration mismatch for Zustand persists:
    const [mounted, setMounted] = useState(false)

    const cart = useStore((state) => state.cart)
    const wishlist = useStore((state) => state.wishlist)

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const cartCount = mounted ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0
    const wishlistCount = mounted ? wishlist.length : 0

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Men', path: '/men' },
        { name: 'Women', path: '/women' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ]

    const isActive = (path: string) => pathname === path

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-background/80 backdrop-blur-md py-3 shadow-sm'
                    : 'bg-transparent py-5'
                    }`}
            >
                <div className="container-custom flex items-center justify-between">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button onClick={() => setMobileMenuOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    <Link href="/" className="flex items-center shrink-0">
                        <Image
                            src="/logo.png"
                            alt="Viraasat Logo"
                            width={240}
                            height={40}
                            className="h-6 sm:h-7 md:h-8 w-auto object-contain"
                            priority
                        />
                    </Link>

                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`text-sm uppercase tracking-wider transition-colors hover:text-foreground relative group ${isActive(link.path) ? 'text-foreground font-semibold' : 'text-foreground/60'}`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 w-0 h-[1.5px] bg-foreground transition-all group-hover:w-full ${isActive(link.path) ? 'w-full' : ''}`}></span>
                            </Link>
                        ))}
                    </div>

                    <SearchBar />

                    <div className="flex items-center gap-3 sm:gap-6 text-foreground/80">
                        <Link 
                            href={session ? "/profile" : "/login"} 
                            className="flex flex-col items-center relative group hover:text-foreground transition-all duration-300"
                        >
                            <User className="w-5 h-5 sm:mb-1 group-hover:scale-110 transition-transform" />
                            <span className="absolute top-full mt-1 text-[10px] items-center uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-foreground font-semibold hidden sm:block">
                                {session ? "Profile" : "Login"}
                            </span>
                        </Link>
                        <Link href="/wishlist" className="relative flex flex-col items-center group hover:text-foreground transition-all duration-300">
                            <Heart className="w-5 h-5 sm:mb-1 group-hover:scale-110 transition-transform" />
                            <span className="absolute top-full mt-1 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-foreground font-semibold hidden sm:block">Wishlist</span>
                            {wishlistCount > 0 && (
                                <span className="absolute top-0 -right-2 bg-brand-cream border border-brand-beige text-foreground text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/cart" className="relative flex flex-col items-center group hover:text-foreground transition-all duration-300">
                            <ShoppingBag className="w-5 h-5 sm:mb-1 group-hover:scale-110 transition-transform" />
                            <span className="absolute top-full mt-1 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-foreground font-semibold hidden sm:block">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute top-0 -right-2 bg-foreground text-background text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm lg:hidden flex flex-col pt-20 px-6"
                    >
                        <button
                            className="absolute top-6 right-6"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <div className="flex flex-col gap-6 text-2xl font-heading mt-10">
                            {/* Mobile search */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    const val = (e.currentTarget.elements.namedItem('mq') as HTMLInputElement)?.value.trim()
                                    if (val) { window.location.href = `/?query=${encodeURIComponent(val)}`; setMobileMenuOpen(false) }
                                }}
                                className="flex items-center gap-2 border border-foreground/20 rounded-2xl px-4 py-3 text-base focus-within:border-foreground/40"
                            >
                                <input name="mq" type="text" placeholder="Search products..." className="flex-1 bg-transparent focus:outline-none text-foreground text-sm placeholder:text-foreground/40" />
                            </form>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`border-b border-foreground/10 pb-4 transition-colors hover:text-foreground ${isActive(link.path) ? 'text-foreground font-bold' : 'text-foreground/60'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href={session ? "/profile" : "/login"}
                                onClick={() => setMobileMenuOpen(false)}
                                className="border-b border-foreground/10 pb-4 transition-colors hover:text-foreground text-foreground/60"
                            >
                                {session ? "Profile" : "Login"}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
