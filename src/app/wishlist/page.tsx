"use client";

import { useStore, Product } from "@/store/useStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, X, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import ProductQuickView from "@/components/ProductQuickView";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useStore();
  const [mounted, setMounted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleMoveToCart = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* ── Decorative background ─────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-150 h-150 rounded-full bg-brand-cream/40 blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-125 h-125 rounded-full bg-brand-beige/30 blur-[100px] translate-y-1/3" />
        <div className="absolute top-1/2 right-0 w-75 h-75 rounded-full bg-brand-cream/20 blur-[80px]" />
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#3B2F2F 1px, transparent 1px), linear-gradient(90deg, #3B2F2F 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <Navbar />

      <div className="flex-1 relative z-10">
        {/* ── Page Header ───────────────────────────────────────────────────── */}
        <div className="container-custom pt-32 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 font-bold flex items-center gap-1.5 mb-3">
                <Sparkles className="w-3 h-3" /> Your Collection
              </p>
              <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground leading-none">
                Wishlist
              </h1>
              <p className="mt-3 text-foreground/50 text-sm max-w-sm leading-relaxed">
                Pieces you love, saved in one place. Move them to your cart
                whenever you&apos;re ready.
              </p>
            </div>

            {mounted && wishlist.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2.5 bg-white border border-brand-beige/80 rounded-2xl px-5 py-3 shadow-sm shrink-0"
              >
                <Heart className="w-4 h-4 fill-red-400 text-red-400" />
                <span className="font-semibold text-sm text-foreground">
                  {wishlist.length} {wishlist.length === 1 ? "item" : "items"}{" "}
                  saved
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              delay: 0.35,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-10 h-px bg-linear-to-r from-transparent via-brand-beige/60 to-transparent origin-left"
          />
        </div>

        {/* ── Content ───────────────────────────────────────────────────────── */}
        <div className="container-custom pb-24">
          {/* Loading skeleton */}
          {!mounted ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-[1.75rem] overflow-hidden bg-white border border-foreground/5 shadow-sm animate-pulse"
                >
                  <div className="aspect-3/4 bg-brand-cream/60" />
                  <div className="p-5 space-y-3">
                    <div className="h-2.5 w-1/3 bg-brand-cream rounded-full" />
                    <div className="h-4 w-3/4 bg-brand-cream rounded-full" />
                    <div className="h-4 w-1/2 bg-brand-cream rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : /* Empty state */
          wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col items-center justify-center bg-white rounded-[2.5rem] border-2 border-dashed border-brand-beige/60 py-28 px-8 text-center shadow-sm max-w-lg mx-auto mt-4"
            >
              <div className="relative mb-7">
                <div className="w-24 h-24 bg-brand-cream rounded-3xl flex items-center justify-center shadow-inner">
                  <Heart className="w-10 h-10 text-brand-beige" />
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-foreground rounded-full flex items-center justify-center shadow-md">
                  <span className="text-background text-xs font-bold">0</span>
                </div>
              </div>
              <h2 className="text-2xl font-heading font-semibold mb-2 text-foreground">
                Nothing saved yet
              </h2>
              <p className="text-foreground/45 mb-9 max-w-xs text-sm leading-relaxed">
                Tap the heart icon on any product to save it here. Build your
                own curated collection.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-foreground text-background px-10 py-3.5 rounded-2xl font-semibold text-sm hover:bg-foreground/85 transition-all hover:scale-105 shadow-lg active:scale-95"
              >
                Explore Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            /* Product grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
              <AnimatePresence mode="popLayout">
                {wishlist.map((item, index) => (
                  <WishlistCard
                    key={item.id}
                    item={item}
                    index={index}
                    onRemove={() => toggleWishlist(item)}
                    onMoveToCart={() => handleMoveToCart(item)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ── Quick View Modal ──────────────────────────────────────────────── */}
      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}

/* ─── Wishlist Card ──────────────────────────────────────────────────────── */

interface WishlistCardProps {
  item: Product;
  index: number;
  onRemove: () => void;
  onMoveToCart: () => void;
}

function WishlistCard({
  item,
  index,
  onRemove,
  onMoveToCart,
}: WishlistCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.93, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: -12 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex flex-col bg-white rounded-[1.75rem] overflow-hidden shadow-md border border-foreground/6 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500"
    >
      {/* ── Image area ── */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-brand-cream/40">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient overlay — fades in on hover */}
        <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

        {/* ── Saved heart badge (top-left) ── */}
        <div className="absolute top-3.5 left-3.5 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
          <Heart className="w-4 h-4 fill-red-400 text-red-400" />
        </div>

        {/* ── Remove button (top-right) ── */}
        <motion.button
          whileTap={{ scale: 0.82 }}
          onClick={onRemove}
          title="Remove from wishlist"
          className="absolute top-3.5 right-3.5 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md text-foreground/50 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </motion.button>

        {/* ── Move to Cart CTA (slides up from bottom on hover) ── */}
        <div className="absolute inset-x-4 bottom-4 z-10 translate-y-[110%] group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            onClick={onMoveToCart}
            className="w-full bg-foreground/90 backdrop-blur-md text-background py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm hover:bg-foreground transition-colors shadow-2xl active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4" />
            Move to Cart
          </button>
        </div>
      </div>

      {/* ── Info section ── */}
      <div className="p-5 flex flex-col gap-2">
        <p className="text-[9px] uppercase tracking-[0.25em] text-foreground/40 font-bold">
          {item.category}
        </p>

        <h3 className="font-heading text-[1.1rem] font-semibold text-foreground line-clamp-1 leading-snug">
          {item.name}
        </h3>

        {/* Price row + quick add */}
        <div className="flex items-center justify-between mt-1">
          <p className="text-lg font-bold text-foreground">
            ₹{item.price.toLocaleString("en-IN")}
          </p>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onMoveToCart}
            className="flex items-center gap-1.5 text-[11px] font-bold text-foreground/50 hover:text-foreground bg-brand-cream/50 hover:bg-brand-cream border border-brand-beige/50 hover:border-brand-beige px-3.5 py-1.5 rounded-xl transition-all duration-200"
          >
            <ShoppingCart className="w-3 h-3" />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
