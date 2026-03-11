"use client"

import RevenueChart from '@/components/admin/RevenueChart'

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-medium text-foreground">Detailed Analytics</h1>
                    <p className="text-foreground/60 mt-1">Deep dive into your store's performance metrics.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-foreground/5 h-[500px] flex flex-col">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-heading font-semibold text-foreground">Revenue Over Time</h2>
                        <p className="text-sm text-foreground/60">Annual performance overview</p>
                    </div>
                </div>
                <div className="flex-1 min-h-0">
                    <RevenueChart />
                </div>
            </div>
            
            <div className="bg-brand-cream/20 border border-brand-beige/50 p-8 rounded-3xl text-center">
                <h3 className="text-xl font-heading font-medium mb-2">More Analytics Coming Soon</h3>
                <p className="text-foreground/60 text-sm max-w-md mx-auto">
                    We're building advanced conversion funnels, customer retention metrics, and traffic sources for your Viraasat dashboard.
                </p>
            </div>
        </div>
    )
}
