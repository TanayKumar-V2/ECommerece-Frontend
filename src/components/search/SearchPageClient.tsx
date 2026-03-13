"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductQuickView from "@/components/ProductQuickView";
import { Product } from "@/store/useStore";

interface SearchPageClientProps {
  products: Product[];
}

export default function SearchPageClient({ products }: SearchPageClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index % 6}
            onOpenQuickView={(p) => {
              setSelectedProduct(p);
              setIsQuickViewOpen(true);
            }}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
}
