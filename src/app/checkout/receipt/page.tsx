"use client"

import { useStore } from '@/store/useStore'
import { Printer, Download, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

function ReceiptContent() {
    const { cart } = useStore()
    const [mounted, setMounted] = useState(false)
    const [orderData, setOrderData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        setMounted(true)
        if (id) {
            setIsLoading(true)
            fetch(`/api/orders/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.error) setOrderData(data)
                })
                .catch(err => console.error('Fetch error:', err))
                .finally(() => setIsLoading(false))
        } else {
            setIsLoading(false)
        }
    }, [id])

    if (!mounted) return null
    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-brand-cream/10"><Loader2 className="w-8 h-8 animate-spin text-foreground/20" /></div>
    
    // Fallback logic if no orderData is found (e.g. preview mode)
    const displayItems = orderData?.products || cart
    const subtotal = orderData ? orderData.totalAmount : displayItems.reduce((acc: any, item: any) => acc + ((item.product?.price || item.price) * item.quantity), 0)
    const shipping = orderData ? 0 : (subtotal > 2000 ? 0 : 150)
    const total = subtotal + shipping
    
    const displayOrderId = orderData ? `VR-${orderData._id.slice(-5).toUpperCase()}` : "VR-PREVIEW"
    const dateStr = orderData 
        ? new Date(orderData.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })

    const billingInfo = orderData?.shippingAddress || {
        name: "John Doe",
        addressLine1: "123 Cozy Street",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001"
    }
    
    const userEmail = orderData?.user?.email || "customer@example.com"

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="min-h-screen bg-brand-cream/10 md:py-12 py-6 px-4 print:bg-white print:p-0">
            
            {/* Header / Actions - Hidden on Print */}
            <div className="max-w-2xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <Link href="/checkout/success" className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Order
                </Link>
                <div className="flex gap-3">
                    <button 
                        onClick={handlePrint}
                        className="px-4 py-2 border border-foreground/10 bg-white rounded-xl text-sm font-medium hover:bg-foreground/5 shadow-sm hover:shadow transition-all flex items-center gap-2 text-foreground/80"
                    >
                        <Printer className="w-4 h-4" /> Print
                    </button>
                    <button 
                        onClick={handlePrint} // Same as print for now since browser handles Save as PDF
                        className="px-4 py-2 bg-foreground text-background rounded-xl text-sm font-medium hover:bg-foreground/90 shadow-sm transition-all flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" /> Save as PDF
                    </button>
                </div>
            </div>

            {/* Receipt Container */}
            <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-foreground/5 print:shadow-none print:border-none print:p-0 print:rounded-none relative overflow-hidden">
                
                {/* Brand Header */}
                <div className="text-center mb-10 pb-8 border-b-2 border-dashed border-foreground/10">
                    <h1 className="text-4xl font-heading tracking-wider text-foreground mb-2">VIRAASAT</h1>
                    <p className="text-sm text-foreground/50 font-medium tracking-widest uppercase">Official Receipt</p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8 mb-10">
                    <div>
                        <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1 font-medium">Billed To</p>
                        <p className="font-medium text-foreground text-sm">{billingInfo.name}</p>
                        <p className="text-foreground/70 text-sm mt-0.5">
                            {billingInfo.addressLine1}<br />
                            {billingInfo.city}, {billingInfo.state} {billingInfo.pincode}<br />
                            {billingInfo.phone || ''}
                        </p>
                    </div>
                    <div className="text-right">
                        <div>
                            <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1 font-medium">Order Number</p>
                            <p className="font-heading font-semibold text-lg text-foreground">{displayOrderId}</p>
                        </div>
                        <div className="mt-4">
                            <p className="text-xs text-foreground/50 uppercase tracking-wider mb-1 font-medium">Date</p>
                            <p className="text-sm text-foreground/70">{dateStr}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs text-foreground/50 uppercase tracking-wider font-medium border-b border-foreground/10 pb-3 mb-4">
                        <span>Description</span>
                        <span>Amount</span>
                    </div>

                    <div className="space-y-4 text-left">
                        {displayItems.map((item: any, index: number) => (
                            <div key={item._id || `${item.id}-${index}`} className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <div className="w-10 h-12 relative rounded overflow-hidden shrink-0 print:hidden bg-brand-cream/30">
                                        <Image 
                                            src={item.product?.images?.[0] || item.image || "/placeholder.jpg"} 
                                            alt={item.product?.title || item.name} 
                                            fill 
                                            className="object-cover" 
                                        />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-foreground text-sm">{item.product?.title || item.name}</p>
                                        <p className="text-xs text-foreground/60 mt-0.5 text-left">Size: {item.size} • Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-sm text-foreground">Rs. {((item.product?.price || item.price) * item.quantity).toLocaleString('en-IN')}</p>
                                    <p className="text-xs text-foreground/40 mt-0.5">Rs. {(item.product?.price || item.price).toLocaleString('en-IN')} each</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Totals */}
                <div className="border-t-2 border-dashed border-foreground/10 pt-6">
                    <div className="space-y-3 w-full sm:w-1/2 ml-auto text-sm">
                        <div className="flex justify-between text-foreground/70">
                            <span>Subtotal</span>
                            <span className="font-medium text-foreground">Rs. {subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-foreground/70">
                            <span>Shipping</span>
                            <span className="font-medium text-foreground">{shipping === 0 ? "Free" : `Rs. ${shipping}`}</span>
                        </div>
                        <div className="flex justify-between text-foreground/70">
                            <span>Tax (Included)</span>
                            <span className="font-medium text-foreground">Rs. 0</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 mt-3 border-t border-foreground/10">
                            <span className="font-medium uppercase tracking-wider text-xs">Total Paid</span>
                            <span className="font-heading font-bold text-2xl text-foreground">Rs. {total.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="mt-16 text-center text-sm text-foreground/50 font-medium">
                    <p>Thank you for shopping with Viraasat.</p>
                    <p className="mt-1 hidden print:block">viraasat.vercel.app</p>
                </div>
            </div>
        </div>
    )
}

export default function ReceiptPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-brand-cream/10 shadow-sm"><Loader2 className="w-8 h-8 animate-spin text-foreground/20" /></div>}>
            <ReceiptContent />
        </Suspense>
    )
}
