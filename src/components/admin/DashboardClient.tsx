"use client"

import { motion } from 'framer-motion'
import { IndianRupee, ShoppingBag, Box, Users, AlertCircle, ArrowRight } from 'lucide-react'
import RevenueChart from '@/components/admin/RevenueChart'
import TopProducts from '@/components/admin/TopProducts'

export default function DashboardClient({ 
  analyticsData, 
  revenueData, 
  topProducts,
  attentionItems,
}: { 
  analyticsData: any[], 
  revenueData: any[], 
  topProducts: any[],
  attentionItems: { id: string; label: string; detail: string; href: string; tone: 'error' | 'warning' }[],
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

            <section aria-labelledby="attention-heading" className="border border-foreground/10 bg-white rounded-2xl p-5">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                        <h2 id="attention-heading" className="text-xl font-heading font-semibold text-foreground">Needs attention</h2>
                        <p className="text-sm text-muted mt-1">Exceptions that need an operator decision.</p>
                    </div>
                    <a href="/admin/orders" className="text-sm font-medium text-foreground underline underline-offset-4">Open orders</a>
                </div>
                {attentionItems.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {attentionItems.map((item) => (
                            <a key={item.id} href={item.href} className={`flex items-start gap-3 rounded-xl border p-3 transition-colors hover:bg-brand-cream/20 ${item.tone === 'error' ? 'border-red-200' : 'border-amber-200'}`}>
                                <AlertCircle className={`mt-0.5 h-4 w-4 shrink-0 ${item.tone === 'error' ? 'text-error' : 'text-warning'}`} />
                                <span className="min-w-0"><span className="block text-sm font-semibold text-foreground">{item.label}</span><span className="block truncate text-xs text-muted mt-1">{item.detail}</span></span>
                                <ArrowRight className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-muted" />
                            </a>
                        ))}
                    </div>
                ) : <p className="rounded-xl bg-brand-cream/20 px-4 py-3 text-sm text-muted">No exceptions are waiting for review.</p>}
            </section>

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
                        className="bg-white p-5 rounded-2xl shadow-sm border border-foreground/5"
                    >
                        <div className="flex justify-between items-start mb-4">
                             <div className={`p-3 rounded-2xl ${item.color} shrink-0`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium text-muted bg-brand-cream/30 px-2 py-1 rounded-full whitespace-nowrap">
                                {item.trend}
                            </span>
                        </div>
                        <h3 className="text-foreground/60 text-sm font-medium mb-1">{item.title}</h3>
                         <p className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-1 truncate">{item.value}</p>
                         <p className="text-xs text-muted line-clamp-1">{item.subtitle}</p>
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
                        <h2 className="text-xl font-heading font-semibold text-foreground">Year-to-date revenue</h2>
                        <p className="text-sm text-foreground/60">Recorded revenue from January through December {new Date().getFullYear()}.</p>
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
                        <h2 className="text-xl font-heading font-semibold text-foreground">Catalog Snapshot</h2>
                        <a href="/admin/products" className="text-xs text-muted font-medium hover:text-foreground transition-colors">Manage products</a>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <TopProducts products={topProducts} />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
