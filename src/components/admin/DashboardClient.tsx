"use client"

import { motion } from 'framer-motion'
import { IndianRupee, ShoppingBag, Box, Users, ArrowUpRight } from 'lucide-react'
import RevenueChart from '@/components/admin/RevenueChart'
import TopProducts from '@/components/admin/TopProducts'

export default function DashboardClient({ 
  analyticsData, 
  revenueData, 
  topProducts 
}: { 
  analyticsData: any[], 
  revenueData: any[], 
  topProducts: any[] 
}) {
    const handleDownloadReport = () => {
        const headers = ["Title", "Value", "Trend", "Subtitle"];
        const rows = analyticsData.map(item => [
            `"${item.title}"`,
            `"${item.value}"`,
            `"${item.trend}"`,
            `"${item.subtitle}"`
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `admin-report-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getIconForTitle = (title: string) => {
      switch(title) {
        case "Total Revenue": return IndianRupee;
        case "Total Orders": return ShoppingBag;
        case "Active Products": return Box;
        case "Total Customers": return Users;
        default: return Box;
      }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-medium text-foreground">Dashboard Overview</h1>
                    <p className="text-foreground/60 mt-1">Welcome back. Here's what's happening with Viraasat today.</p>
                </div>
                <button 
                    onClick={handleDownloadReport}
                    className="px-4 py-2 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors shadow-sm inline-flex items-center gap-2"
                >
                    Download Report
                </button>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {analyticsData.map((item, index) => {
                    const Icon = getIconForTitle(item.title);
                    return (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] shadow-sm border border-foreground/5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${item.color} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full whitespace-nowrap">
                                {item.trend} <ArrowUpRight className="w-3 h-3 ml-0.5" />
                            </span>
                        </div>
                        <h3 className="text-foreground/60 text-sm font-medium mb-1">{item.title}</h3>
                        <p className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-1 group-hover:text-brand-beige transition-colors truncate">{item.value}</p>
                        <p className="text-xs text-foreground/40 line-clamp-1">{item.subtitle}</p>
                    </motion.div>
                )})}
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
                        <RevenueChart data={revenueData} />
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
                        <TopProducts products={topProducts} />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
