import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ProductCarousel from "@/components/ProductCarousel";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import ProductCard from "@/components/ProductCard";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  await dbConnect();

  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.query?.trim();

  if (query) {
    // ── Search mode ──────────────────────────────────────────────────────────
    const productsResult = await Product.find({
      title: { $regex: query, $options: "i" },
    })
      .limit(24)
      .lean();

    const results = productsResult.map((p: any) => ({
      id: p._id.toString(),
      name: p.title,
      price: p.price,
      image: p.images[0],
      category: (p.category.charAt(0).toUpperCase() +
        p.category.slice(1)) as "Men" | "Women" | "Unisex",
    }));

    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container-custom pt-36 pb-20">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-foreground/40 font-semibold mb-2">
              Search Results
            </p>
            <h1 className="text-3xl md:text-4xl font-heading font-semibold">
              &ldquo;{query}&rdquo;
            </h1>
            <p className="text-foreground/50 mt-1 text-sm">
              {results.length > 0
                ? `${results.length} result${results.length !== 1 ? "s" : ""} found`
                : "No products matched your search"}
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {results.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index % 6}
                  onOpenQuickView={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-foreground/40">
              <p className="text-4xl mb-4">🔍</p>
              <p className="font-heading text-xl mb-2">Nothing found</p>
              <p className="text-sm">
                Try a different keyword, or{" "}
                <a href="/" className="underline underline-offset-2 hover:text-foreground transition-colors">
                  browse all products
                </a>
              </p>
            </div>
          )}
        </div>
        <Footer />
      </main>
    );
  }

  // ── Default home page ─────────────────────────────────────────────────────
  const productsResult = await Product.find({}).limit(8).lean();

  const trendingProducts = productsResult.map((p: any) => ({
    id: p._id.toString(),
    name: p.title,
    price: p.price,
    image: p.images[0],
    category: (p.category.charAt(0).toUpperCase() +
      p.category.slice(1)) as "Men" | "Women" | "Unisex",
  }));

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

      <RecentlyViewed />

      <Footer />
    </main>
  );
}
