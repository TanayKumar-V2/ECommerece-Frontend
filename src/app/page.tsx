"use client"

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ProductCarousel from "@/components/ProductCarousel";
import { DUMMY_PRODUCTS } from "@/data/products";
import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";

export default function Home() {
  const trendingProducts = DUMMY_PRODUCTS.slice(0, 5);
  const { recentlyViewed } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <Hero />

      <FeaturedCategories />

      <div className="bg-brand-cream/10 border-t border-brand-beige/20">
        <ProductCarousel
          title="Trending Now"
          subtitle="Our most loved pieces this season, carefully crafted to elevate your everyday wardobe."
          products={trendingProducts}
        />
      </div>

      {mounted && recentlyViewed.length > 0 && (
        <div className="bg-background">
          <ProductCarousel
            title="Recently Viewed"
            subtitle="Pick up right where you left off. Review items you have explored recently."
            products={recentlyViewed}
          />
        </div>
      )}

      <Footer />
    </main>
  );
}
