import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import CategoryFilters from "@/components/CategoryFilters";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export default async function WomenPage({
  searchParams,
}: {
  searchParams: Promise<{ size?: string; sort?: string }>;
}) {
  await dbConnect();

  const resolvedSearchParams = await searchParams;

  // Build the query dynamically
  const filter: Record<string, any> = {
    category: { $in: ["women", "unisex"] },
  };

  if (resolvedSearchParams.size) {
    filter.sizes = { $in: [resolvedSearchParams.size] };
  }

  // Sort direction
  const sortDir =
    resolvedSearchParams.sort === "asc"
      ? { price: 1 as const }
      : resolvedSearchParams.sort === "desc"
      ? { price: -1 as const }
      : { createdAt: -1 as const };

  const productsResult = await Product.find(filter).sort(sortDir as any).lean();

  const womenProducts = productsResult.map((p: any) => ({
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
      <CategoryFilters />
      <ProductGrid
        title="Women's Collection"
        description="Elegant, flowing, and cozy. Explore modern silhouettes rooted in traditional aesthetics, crafted for your daily wardrobe."
        products={womenProducts}
      />
      <Footer />
    </main>
  );
}
