"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

import { Suspense } from "react";

function CategoryFiltersInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeSize = searchParams.get("size") ?? "";
  const activeSort = searchParams.get("sort") ?? "";

  const buildUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    return `${pathname}?${params.toString()}`;
  };

  const handleSize = (size: string) => {
    // Toggle the size: clicking active size clears it
    router.replace(buildUrl({ size: activeSize === size ? "" : size }), {
      scroll: false,
    });
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.replace(buildUrl({ sort: e.target.value }), { scroll: false });
  };

  const hasFilters = activeSize || activeSort;

  const clearAll = () => {
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="container-custom pt-28 pb-2">
      <div className="flex flex-wrap items-center gap-3">
        {/* Icon label */}
        <div className="flex items-center gap-1.5 text-foreground/50 text-xs uppercase tracking-widest font-semibold mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter</span>
        </div>

        {/* Size pills */}
        {SIZES.map((size) => (
          <button
            key={size}
            onClick={() => handleSize(size)}
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border transition-all duration-200 ${
              activeSize === size
                ? "bg-foreground text-background border-foreground shadow-sm"
                : "border-foreground/20 text-foreground/60 hover:border-foreground/50 hover:text-foreground"
            }`}
          >
            {size}
          </button>
        ))}

        {/* Divider */}
        <div className="w-px h-4 bg-foreground/15" />

        {/* Sort select */}
        <select
          value={activeSort}
          onChange={handleSort}
          className="px-3 py-1 rounded-full text-xs font-semibold border border-foreground/20 text-foreground/70 bg-transparent focus:outline-none focus:ring-1 focus:ring-brand-beige hover:border-foreground/40 transition-all cursor-pointer appearance-none pr-6 relative"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%233B2F2F60'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
        >
          <option value="">Sort: Default</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>

        {/* Clear all */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="ml-auto text-[11px] text-foreground/40 hover:text-foreground underline underline-offset-2 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

export default function CategoryFilters() {
  return (
    <Suspense fallback={<div className="container-custom pt-28 pb-2 h-16" />}>
      <CategoryFiltersInner />
    </Suspense>
  );
}
