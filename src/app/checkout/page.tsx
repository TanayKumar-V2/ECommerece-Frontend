"use client"

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Script from 'next/script'

declare global {
  interface Window {
    Razorpay: any;
  }
}

const InputField = ({ id, label, type = "text", placeholder, value, onChange }: { id: string, label: string, type?: string, placeholder?: string, value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-sm font-medium text-foreground/80">{label}</label>
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
            className="px-4 py-3.5 bg-white border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige focus:border-transparent transition-all"
        />
    </div>
)

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import OrderSuccess from '@/components/checkout/OrderSuccess'
import PageTransition from '@/components/PageTransition'
import { useToastStore } from '@/store/toastStore'

export default function CheckoutPage() {
    const { cart, clearCart, updateCartPrices } = useStore()
    const { addToast } = useToastStore()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [orderId, setOrderId] = useState<string | null>(null)
    const [priceChanges, setPriceChanges] = useState<{ id: string; name: string; oldPrice: number; newPrice: number }[]>([])
    const [paymentError, setPaymentError] = useState('')

    // Form State
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [pincode, setPincode] = useState('')
    const [phone, setPhone] = useState('')
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online')

    useEffect(() => setMounted(true), [])

    useEffect(() => {
      if (!mounted || cart.length === 0 || !email) return
      const timer = setTimeout(() => {
        fetch('/api/cart/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, items: cart }),
        }).catch(() => {})
      }, 2000)
      return () => clearTimeout(timer)
    }, [email, mounted])

    useEffect(() => {
      if (!mounted || cart.length === 0) return

      const ids = [...new Set(cart.map((i) => i.id))]
      fetch(`/api/products/prices?ids=${ids.join(',')}`)
        .then((r) => r.json())
        .then((data) => {
          if (!data.prices) return
          const changes: typeof priceChanges = []
          for (const item of cart) {
            const serverPrice = data.prices[item.id]
            if (serverPrice !== undefined && serverPrice !== item.price) {
              changes.push({
                id: item.id,
                name: item.name,
                oldPrice: item.price,
                newPrice: serverPrice,
              })
            }
          }
          if (changes.length > 0) {
            setPriceChanges(changes)
            addToast('info', 'Some item prices have been updated to reflect current rates.')
            updateCartPrices(data.prices)
          }
        })
        .catch(() => {})
    }, [mounted])

    const subtotal = mounted ? cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0
    const shipping = 63
    const total = subtotal + shipping

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (cart.length === 0) return;
        setIsProcessing(true)
        setPaymentError('')

        try {
            if (paymentMethod === 'cod') {
                const orderRes = await fetch('/api/checkout/cod', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items: cart,
                        shippingAddress: { email, firstName, lastName, address, city, state, pincode, phone }
                    })
                });
                const orderData = await orderRes.json();
                
                if (!orderRes.ok) throw new Error(orderData.error);
                
                setOrderId(orderData.order_id);
                setIsSuccess(true);
                clearCart();
                setIsProcessing(false);
                return;
            }

            // 1. Create Order on Server
            const orderRes = await fetch('/api/checkout/razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    shippingAddress: { email, firstName, lastName, address, city, state, pincode, phone }
                })
            });
            const orderData = await orderRes.json();

            if (!orderRes.ok) throw new Error(orderData.error);

            // 2. Initialize Razorpay Modal
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key from env
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Viraasat",
                description: "Order Payment",
                order_id: orderData.order_id,
                handler: async function (response: any) {
                    try {
                        // 3. Verify Payment
                        const verifyRes = await fetch('/api/checkout/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                mongo_order_id: orderData.mongo_order_id
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok) {
                            setOrderId(orderData.mongo_order_id);
                            setIsSuccess(true);
                            clearCart();
                        } else {
                            throw new Error(verifyData.error || "Payment verification failed");
                        }
                    } catch (err) {
                        console.error('Verification error:', err);
                        setPaymentError('Payment verification could not be completed. You can retry payment or contact support at messaging@viraasatclothing.store.');
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: `${firstName} ${lastName}`,
                    email: email,
                    contact: phone
                },
                theme: {
                    color: "#0F0F0F" // Brand foreground color
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any){
                setPaymentError(`Payment failed${response?.error?.description ? `: ${response.error.description}` : '.'} You can try again or choose Cash on Delivery.`);
                setIsProcessing(false);
            });
            rzp.open();

        } catch (error: any) {
            console.error('Checkout error:', error);
            setPaymentError(error?.message || 'We could not start checkout. Please try again.');
            setIsProcessing(false);
        }
    }

    const onAnimationComplete = () => {
        router.push(`/checkout/success?id=${orderId}`)
    }

    if (mounted && cart.length === 0 && !isSuccess) {
        return <PageTransition><main className="min-h-screen bg-background flex flex-col"><Navbar /><div className="flex-1 container-custom py-32 text-center"><h1 className="text-4xl font-heading mb-4">Your bag is empty</h1><p className="text-foreground/70 mb-8">Add something you love before starting checkout.</p><Link href="/" className="inline-flex rounded-full bg-foreground px-7 py-3.5 font-medium text-background">Browse collection</Link></div><Footer /></main></PageTransition>
    }

    return (
        <PageTransition>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
            <main className="min-h-screen bg-background flex flex-col relative">
            <Navbar />
            <div className="flex-1 py-24 container-custom max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-heading mb-10">Checkout</h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Shipping Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {priceChanges.length > 0 && (
                          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm">
                            <p className="font-semibold text-amber-800 mb-2">Prices Updated</p>
                            <ul className="space-y-1 text-amber-700">
                              {priceChanges.map((c) => (
                                <li key={c.id}>
                                   {c.name}: <span className="line-through">₹{c.oldPrice.toLocaleString('en-IN')}</span>
                                   {' → '}<span className="font-semibold">₹{c.newPrice.toLocaleString('en-IN')}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <form onSubmit={handlePayment} className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-foreground/5 relative overflow-hidden">
                            <div>
                                <h3 className="text-xl font-heading mb-6 border-b border-foreground/10 pb-4">Contact Information</h3>
                                 <InputField id="checkout-email" label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div>
                                <h3 className="text-xl font-heading mb-6 border-b border-foreground/10 pb-4">Shipping Address</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                     <InputField id="checkout-first-name" label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                     <InputField id="checkout-last-name" label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                     <div className="sm:col-span-2"><InputField id="checkout-address" label="Address" placeholder="123 Cozy Street" value={address} onChange={(e) => setAddress(e.target.value)} /></div>
                                     <InputField id="checkout-city" label="City" value={city} onChange={(e) => setCity(e.target.value)} />
                                     <InputField id="checkout-state" label="State" value={state} onChange={(e) => setState(e.target.value)} />
                                     <InputField id="checkout-pincode" label="PIN Code" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                                     <InputField id="checkout-phone" label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <fieldset>
                                  <legend className="text-xl font-heading mb-6 border-b border-foreground/10 pb-4 w-full">Payment Method</legend>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                      { value: 'online' as const, label: 'Pay Online', description: 'Secure payment via Razorpay' },
                                      { value: 'cod' as const, label: 'Cash on Delivery', description: 'Pay when your order arrives' },
                                    ].map((option) => (
                                      <label key={option.value} className={`p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === option.value ? 'border-brand-beige bg-brand-cream/20 shadow-sm' : 'border-foreground/10 hover:border-foreground/30'}`}>
                                        <span className="flex items-start gap-3">
                                          <input type="radio" name="payment-method" value={option.value} checked={paymentMethod === option.value} onChange={() => setPaymentMethod(option.value)} className="mt-1 accent-foreground" />
                                          <span><span className="font-medium block">{option.label}</span><span className="text-xs text-foreground/60">{option.description}</span></span>
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </fieldset>
                             </div>

                             {paymentError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><p>{paymentError}</p><button type="button" onClick={() => setPaymentError('')} className="mt-2 font-semibold underline underline-offset-2">Try again</button></div>}

                             <p className="text-xs text-foreground/70">Shipping is ₹63. Orders usually ship within 2–5 business days. Review your address before placing the order.</p>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-foreground text-background py-4 flex items-center justify-center gap-2 rounded-xl font-medium hover:bg-foreground/90 transition-all hover:shadow-lg hover:-translate-y-1 transform duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {isProcessing ? 'Processing...' : paymentMethod === 'cod' ? `Place COD order` : `Pay ₹${total.toLocaleString('en-IN')}`}
                            </button>
                        </form>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="order-first lg:order-last"
                    >
                        <div className="bg-brand-cream/20 p-6 md:p-8 rounded-3xl sticky top-28 border border-brand-beige/30">
                            <h3 className="text-xl font-heading mb-6">In your bag</h3>

                            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto hidden-scrollbar pr-2">
                                {!mounted ? null : cart.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                        <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0">
                                            <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-foreground/60 text-xs">Size: {item.size} • Qty: {item.quantity}</p>
                                        </div>
                                        <div className="flex items-center">
                                             <p className="font-semibold text-sm w-max whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-brand-beige/40 text-sm text-foreground/80">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                     <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                     <span>₹{shipping}</span>
                                </div>
                            </div>

                            <div className="border-t border-brand-beige/40 py-4 mt-4">
                                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-foreground/5 shadow-sm">
                                    <span className="font-medium">Total</span>
                                     <span className="font-bold text-xl font-heading">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />

            <AnimatePresence>
                {isSuccess && <OrderSuccess onComplete={onAnimationComplete} />}
            </AnimatePresence>
        </main>
        </PageTransition>
    )
}
