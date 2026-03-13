"use client"

import { useState, useEffect, useRef } from 'react'
import { Bell, Menu, Search, User, X, Check, Trash2, Clock } from 'lucide-react'
import Link from 'next/link'
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '@/actions/notificationActions'
import { formatDistanceToNow } from 'date-fns'

export default function AdminNavbar({ onMenuClick }: { onMenuClick: () => void }) {
    const [notifications, setNotifications] = useState<any[]>([])
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const fetchNotifications = async () => {
        const res = await getNotifications()
        if (res.success) {
            setNotifications(res.notifications)
        }
    }

    useEffect(() => {
        fetchNotifications()
        // Poll for notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleMarkAsRead = async (id: string) => {
        const res = await markAsRead(id)
        if (res.success) {
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n))
        }
    }

    const handleMarkAllAsRead = async () => {
        const res = await markAllAsRead()
        if (res.success) {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        }
    }

    const handleDeleteNotification = async (id: string) => {
        const res = await deleteNotification(id)
        if (res.success) {
            setNotifications(prev => prev.filter(n => n._id !== id))
        }
    }

    const unreadCount = notifications.filter(n => !n.read).length

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
                
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className={`p-2 rounded-full transition-colors relative ${isNotificationOpen ? 'bg-brand-cream/50 text-foreground' : 'text-foreground/60 hover:text-foreground hover:bg-brand-cream/50'}`}
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationOpen && (
                        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white border border-foreground/10 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 border-b border-foreground/5 flex items-center justify-between">
                                <h3 className="font-heading font-semibold text-foreground">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={handleMarkAllAsRead}
                                        className="text-xs text-brand-beige font-medium hover:text-foreground transition-colors"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    <div className="divide-y divide-foreground/5">
                                        {notifications.map((n) => (
                                            <div 
                                                key={n._id} 
                                                className={`p-4 hover:bg-brand-cream/10 transition-colors group relative ${!n.read ? 'bg-brand-cream/5' : ''}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!n.read ? 'bg-brand-beige' : 'bg-transparent'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                            <p className={`text-sm font-medium text-foreground truncate ${!n.read ? 'font-semibold' : ''}`}>{n.title}</p>
                                                            <span className="text-[10px] text-foreground/40 flex items-center gap-1 shrink-0">
                                                                <Clock className="w-3 h-3" />
                                                                {formatDistanceToNow(new Date(n.createdAt))} ago
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-foreground/60 line-clamp-2 leading-relaxed">{n.message}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-3 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!n.read && (
                                                        <button 
                                                            onClick={() => handleMarkAsRead(n._id)}
                                                            className="p-1.5 text-foreground/40 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDeleteNotification(n._id)}
                                                        className="p-1.5 text-foreground/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <div className="w-12 h-12 bg-brand-cream/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Bell className="w-6 h-6 text-foreground/20" />
                                        </div>
                                        <p className="text-sm text-foreground/40 font-medium">No notifications yet</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-3 bg-brand-cream/5 border-t border-foreground/5 text-center">
                                <Link 
                                    href="/admin/analytics" 
                                    className="text-xs text-foreground/60 hover:text-brand-beige font-medium transition-colors"
                                    onClick={() => setIsNotificationOpen(false)}
                                >
                                    View all activity
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
                
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
