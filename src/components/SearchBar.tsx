"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Suspense } from "react";

function SearchBarInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [isFocused, setIsFocused] = useState(false);

  // Keep input in sync if user navigates back/forward
  useEffect(() => {
    setQuery(searchParams.get("query") ?? "");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/?query=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/");
    }
  };

  const handleClear = () => {
    setQuery("");
    router.push("/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative hidden md:flex items-center transition-all duration-300 ${
        isFocused ? "w-44 lg:w-56" : "w-36 lg:w-40"
      }`}
    >
      <Search className="absolute left-3 w-3.5 h-3.5 text-foreground/40 pointer-events-none" />
      <input
        aria-label="Search products"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search..."
        className="w-full pl-8 pr-11 py-2 text-sm bg-brand-cream/30 border border-brand-beige/50 rounded-full focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent transition-all placeholder:text-muted"
      />
      {query && (
        <button
          type="button"
          aria-label="Clear product search"
          onClick={handleClear}
          className="absolute right-1 min-w-10 min-h-10 flex items-center justify-center text-muted hover:text-foreground transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </form>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={<div className="w-36 md:w-40 hidden md:block" />}>
      <SearchBarInner />
    </Suspense>
  );
}
