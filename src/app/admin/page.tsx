"use client"

import { motion } from 'framer-motion'
import { IndianRupee, ShoppingBag, Box, Users, ArrowUpRight } from 'lucide-react'
import RevenueChart from '@/components/admin/RevenueChart'
import TopProducts from '@/components/admin/TopProducts'

const analyticsData = [
    {
        title: "Total Revenue",
        value: "Rs. 25,480",
        subtitle: "From completed orders",
        icon: IndianRupee,
        trend: "+12.5%",
        color: "bg-orange-50 text-orange-600"
    },
    {
        title: "Total Orders",
        value: "142",
        subtitle: "All orders received",
        icon: ShoppingBag,
        trend: "+8.2%",
        color: "bg-blue-50 text-blue-600"
    },
    {
        title: "Active Products",
        value: "36",
        subtitle: "Products currently available",
        icon: Box,
        trend: "+2",
        color: "bg-emerald-50 text-emerald-600"
    },
    {
        title: "Total Customers",
        value: "98",
        subtitle: "Registered accounts",
        icon: Users,
        trend: "+15.3%",
        color: "bg-purple-50 text-purple-600"
    }
]

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-medium text-foreground">Dashboard Overview</h1>
                    <p className="text-foreground/60 mt-1">Welcome back. Here's what's happening with Viraasat today.</p>
                </div>
                <button className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors shadow-sm inline-flex items-center gap-2">
                    Download Report
                </button>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {analyticsData.map((item, index) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] shadow-sm border border-foreground/5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${item.color} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full whitespace-nowrap">
                                {item.trend} <ArrowUpRight className="w-3 h-3 ml-0.5" />
                            </span>
                        </div>
                        <h3 className="text-foreground/60 text-sm font-medium mb-1">{item.title}</h3>
                        <p className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-1 group-hover:text-brand-beige transition-colors truncate">{item.value}</p>
                        <p className="text-xs text-foreground/40 line-clamp-1">{item.subtitle}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="lg:col-span-2 bg-white p-6 rounded-[2rem] shadow-sm border border-foreground/5"
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-heading font-semibold text-foreground">Monthly Revenue</h2>
                        <p className="text-sm text-foreground/60">Revenue growth over the past 12 months</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <RevenueChart />
                    </div>
                </motion.div>

                {/* Top Selling Products */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-foreground/5 flex flex-col"
                >
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-xl font-heading font-semibold text-foreground">Top Products</h2>
                        <button className="text-xs text-brand-beige font-medium hover:text-foreground transition-colors">View All</button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <TopProducts />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
