"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Calendar, ChevronDown, PackageCheck, Truck, XCircle, Clock, CheckCircle2 } from 'lucide-react'

// Extended Mock Data
const initialOrders = [
    { id: 'VR-1043', customer: 'Aryan Sharma', product: 'Cyberpunk Oversized Tee', qty: 2, total: 2998, phone: '+91 98765 43210', status: 'Pending' },
    { id: 'VR-1042', customer: 'Priya Patel', product: 'Street Ninja Cargo Pants', qty: 1, total: 2499, phone: '+91 87654 32109', status: 'Processing' },
    { id: 'VR-1041', customer: 'Rahul Kumar', product: 'Glitch Art Hoodie', qty: 1, total: 2899, phone: '+91 76543 21098', status: 'Shipped' },
    { id: 'VR-1040', customer: 'Sneha Gupta', product: 'Minimalist Beige Turtle', qty: 3, total: 3897, phone: '+91 65432 10987', status: 'Delivered' },
    { id: 'VR-1039', customer: 'Vikram Singh', product: 'Essence Linen Shirt', qty: 1, total: 1899, phone: '+91 54321 09876', status: 'Cancelled' },
    { id: 'VR-1038', customer: 'Ananya Desai', product: 'Cyberpunk Oversized Tee', qty: 1, total: 1499, phone: '+91 91234 56780', status: 'Delivered' },
]

const statusStyles = {
    'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Processing': 'bg-blue-50 text-blue-700 border-blue-200',
    'Shipped': 'bg-purple-50 text-purple-700 border-purple-200',
    'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Cancelled': 'bg-red-50 text-red-700 border-red-200',
} as Record<string, string>

const statusIcons = {
    'Pending': Clock,
    'Processing': PackageCheck,
    'Shipped': Truck,
    'Delivered': CheckCircle2,
    'Cancelled': XCircle
}

export default function OrdersPage() {
    const [orders, setOrders] = useState(initialOrders)

    const handleStatusChange = (orderId: string, newStatus: string) => {
        setOrders(orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ))
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-medium text-foreground">Order Management</h1>
                    <p className="text-foreground/60 mt-1">Track, update, and manage customer orders.</p>
                </div>
            </div>

            {/* Orders Analytics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-foreground/5 flex items-center justify-between group">
                    <div>
                        <p className="text-foreground/60 text-sm font-medium mb-1">Orders Today</p>
                        <p className="text-3xl font-heading font-semibold text-foreground">24</p>
                    </div>
                    <div className="p-4 bg-brand-cream/50 rounded-2xl group-hover:bg-brand-beige transition-colors duration-300">
                        <PackageCheck className="w-6 h-6 text-foreground/70" />
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl shadow-sm border border-foreground/5 flex items-center justify-between group">
                    <div>
                        <p className="text-foreground/60 text-sm font-medium mb-1">Orders This Week</p>
                        <p className="text-3xl font-heading font-semibold text-foreground">142</p>
                    </div>
                    <div className="p-4 bg-brand-cream/50 rounded-2xl group-hover:bg-brand-beige transition-colors duration-300">
                        <Calendar className="w-6 h-6 text-foreground/70" />
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl shadow-sm border border-foreground/5 flex items-center justify-between group">
                    <div>
                        <p className="text-foreground/60 text-sm font-medium mb-1">Orders This Month</p>
                        <p className="text-3xl font-heading font-semibold text-foreground">584</p>
                    </div>
                    <div className="p-4 bg-brand-cream/50 rounded-2xl group-hover:bg-brand-beige transition-colors duration-300">
                        <svg className="w-6 h-6 text-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-foreground/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                    <input 
                        type="text" 
                        placeholder="Search orders by ID or customer..." 
                        className="w-full pl-9 pr-4 py-2 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige focus:border-transparent transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <select className="px-4 py-2 bg-brand-cream/10 border border-brand-beige/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-beige">
                        <option>All Statuses</option>
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-foreground/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-foreground/10 bg-brand-cream/10 text-xs uppercase tracking-wider text-foreground/60">
                                <th className="p-4 font-medium pl-6">Order ID</th>
                                <th className="p-4 font-medium">Customer</th>
                                <th className="p-4 font-medium">Product</th>
                                <th className="p-4 font-medium text-center">Qty</th>
                                <th className="p-4 font-medium">Total Price</th>
                                <th className="p-4 font-medium">Phone Number</th>
                                <th className="p-4 font-medium pr-6">Status Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => {
                                const StatusIcon = statusIcons[order.status as keyof typeof statusIcons]
                                return (
                                <motion.tr 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    key={order.id} 
                                    className="border-b border-foreground/5 hover:bg-brand-cream/10 transition-colors"
                                >
                                    <td className="p-4 pl-6 font-medium text-sm text-foreground">{order.id}</td>
                                    <td className="p-4 text-sm text-foreground/80 font-medium">{order.customer}</td>
                                    <td className="p-4 text-sm text-foreground/70">{order.product}</td>
                                    <td className="p-4 text-sm text-foreground/80 text-center">{order.qty}</td>
                                    <td className="p-4 text-sm font-semibold">Rs. {order.total.toLocaleString('en-IN')}</td>
                                    <td className="p-4 text-sm text-foreground/60">{order.phone}</td>
                                    <td className="p-4 pr-6">
                                        <div className="relative inline-block w-full">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`appearance-none w-full px-3 py-1.5 pr-8 rounded-lg text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors cursor-pointer ${statusStyles[order.status]}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                            <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                        </div>
                                    </td>
                                </motion.tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
