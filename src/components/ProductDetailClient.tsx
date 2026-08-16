"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Product, useStore } from "@/store/useStore"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useStore()
  const sizes = product.sizes?.length ? product.sizes : ["S", "M", "L", "XL"]
  const colors = product.colors?.length ? product.colors : ["Black"]
  const [size, setSize] = useState(sizes[0])
  const [color, setColor] = useState(colors[0])
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const images = product.images?.length ? product.images : [product.image]

  const handleAdd = () => {
    addToCart({ ...product, image: images[0], quantity, size, color })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return <main className="min-h-screen bg-background"><Navbar /><div className="container-custom py-28"><Link href={product.category === "Women" ? "/women" : "/men"} className="text-sm text-muted underline underline-offset-4">Back to collection</Link><div className="mt-8 grid gap-10 lg:grid-cols-2"><div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-brand-cream/30"><Image src={images[0] || "/placeholder.jpg"} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div><div className="max-w-xl self-center"><p className="text-xs uppercase tracking-widest text-muted font-semibold">{product.category}</p><h1 className="mt-3 text-4xl md:text-5xl font-heading">{product.name}</h1><p className="mt-4 text-2xl font-semibold">₹{product.price.toLocaleString("en-IN")}</p>{product.description && <p className="mt-6 leading-relaxed text-foreground/80">{product.description}</p>}<p className="mt-5 text-sm text-muted">Shipping is ₹63. Orders usually ship within 2–5 business days. Contact support for returns help.</p>{product.stock === 0 ? <p className="mt-5 font-semibold text-error">Out of stock</p> : product.stock !== undefined && product.stock <= 5 ? <p className="mt-5 font-semibold text-warning">Only {product.stock} left in stock</p> : null}<div className="mt-8 space-y-6"><fieldset><legend className="text-sm font-semibold uppercase tracking-wider">Color</legend><div className="mt-3 flex flex-wrap gap-2">{colors.map((option) => <button key={option} type="button" aria-pressed={color === option} onClick={() => setColor(option)} className={`rounded-xl border px-4 py-2 text-sm ${color === option ? "border-foreground bg-foreground text-background" : "border-brand-beige/60"}`}>{option}</button>)}</div></fieldset><fieldset><legend className="text-sm font-semibold uppercase tracking-wider">Size</legend><div className="mt-3 flex flex-wrap gap-2">{sizes.map((option) => <button key={option} type="button" aria-pressed={size === option} onClick={() => setSize(option)} className={`min-h-11 min-w-11 rounded-xl border px-3 py-2 text-sm ${size === option ? "border-foreground bg-foreground text-background" : "border-brand-beige/60"}`}>{option}</button>)}</div></fieldset><div><span className="text-sm font-semibold uppercase tracking-wider">Quantity</span><div className="mt-3 flex w-max items-center gap-4 rounded-xl border border-brand-beige/60 px-3"><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="min-h-11 min-w-11">−</button><span aria-live="polite">{quantity}</span><button type="button" aria-label="Increase quantity" disabled={product.stock !== undefined && quantity >= product.stock} onClick={() => setQuantity(product.stock !== undefined ? Math.min(product.stock, quantity + 1) : quantity + 1)} className="min-h-11 min-w-11 disabled:opacity-40">+</button></div></div><button type="button" onClick={handleAdd} disabled={product.stock === 0} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-6 font-medium text-background disabled:opacity-50">{added ? "Added to cart" : product.stock === 0 ? "Out of stock" : <><ShoppingCart className="h-5 w-5" />Add to cart · ₹{(product.price * quantity).toLocaleString("en-IN")}</>}</button></div></div></div></div><Footer /></main>
}
