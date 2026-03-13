"use client"

import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import ProductCarousel from "@/components/ProductCarousel";

export default function RecentlyViewed() {
  const { recentlyViewed } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || recentlyViewed.length === 0) return null;

  return (
    <div className="bg-background">
      <ProductCarousel
        title="Recently Viewed"
        subtitle="Pick up right where you left off. Review items you have explored recently."
        products={recentlyViewed}
      />
    </div>
  );
}
