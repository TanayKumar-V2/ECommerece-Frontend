"use client"

import { Bell, Menu, Search, User } from 'lucide-react'
import Link from 'next/link'

export default function AdminNavbar({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="h-16 bg-white border-b border-foreground/10 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-foreground/60 hover:text-foreground hover:bg-brand-cream/50 rounded-lg transition-colors lg:hidden"
                >
                    <Menu className="w-5 h-5" />
                </button>
                
                {/* Desktop Search */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-brand-cream/20 border border-foreground/10 rounded-full focus-within:ring-2 focus-within:ring-brand-beige focus-within:border-transparent transition-all">
                    <Search className="w-4 h-4 text-foreground/40" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-foreground/40"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                <Link href="/" className="text-sm font-medium text-foreground/60 hover:text-brand-beige transition-colors mr-2 hidden sm:block">
                    View Store &rarr;
                </Link>
                
                <button className="p-2 text-foreground/60 hover:text-foreground hover:bg-brand-cream/50 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                <div className="h-8 w-px bg-foreground/10 mx-1 hidden sm:block"></div>
                
                <div className="flex items-center gap-3 pl-1 cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-brand-beige flex items-center justify-center text-foreground font-medium group-hover:scale-105 transition-transform">
                        AD
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium leading-none mb-1">Admin User</p>
                        <p className="text-xs text-foreground/50 leading-none">Store Owner</p>
                    </div>
                </div>
            </div>
        </header>
    )
}
