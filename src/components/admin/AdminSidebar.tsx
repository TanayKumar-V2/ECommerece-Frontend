"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react'

export default function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
    const pathname = usePathname()

    const navItems = [
        { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { title: 'Products', href: '/admin/products', icon: Package },
        { title: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 }
    ]

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-foreground/20 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ x: isOpen ? 0 : -300 }}
                className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-foreground/10 z-50 lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-xl lg:shadow-none"
                style={{ translateX: isOpen ? 0 : '-100%' }} // Fallback for initial render
            >
                {/* Mobile Close Button */}
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 text-foreground/60 hover:text-foreground lg:hidden"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Brand */}
                <div className="p-6 border-b border-foreground/10">
                    <Link href="/admin" className="block w-fit">
                        <span className="text-2xl font-heading font-medium tracking-wide">Admin Panel</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-brand-beige text-foreground font-medium' : 'text-foreground/70 hover:bg-brand-cream/50 hover:text-foreground'}`}>
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-foreground' : 'text-foreground/50 group-hover:text-foreground/80'}`} />
                                    <span>{item.title}</span>
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-foreground/10 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/70 hover:bg-brand-cream/50 hover:text-foreground transition-all duration-200 group">
                        <Settings className="w-5 h-5 text-foreground/50 group-hover:text-foreground/80" />
                        <span>Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group">
                        <LogOut className="w-5 h-5 text-red-500/50 group-hover:text-red-500/80" />
                        <span>Logout</span>
                    </button>
                </div>
            </motion.aside>

            {/* Desktop Styles override */}
            <style jsx global>{`
                @media (min-width: 1024px) {
                    aside { transform: translateX(0) !important; }
                }
            `}</style>
        </>
    )
}
