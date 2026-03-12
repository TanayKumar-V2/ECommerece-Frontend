import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import CategoryFilters from "@/components/CategoryFilters";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export default async function MenPage({
  searchParams,
}: {
  searchParams: { size?: string; sort?: string };
}) {
  await dbConnect();

  // Build the query dynamically
  const filter: Record<string, any> = {
    category: { $in: ["men", "unisex"] },
  };

  if (searchParams.size) {
    filter.sizes = { $in: [searchParams.size] };
  }

  // Sort direction
  const sortDir =
    searchParams.sort === "asc"
      ? { price: 1 as const }
      : searchParams.sort === "desc"
      ? { price: -1 as const }
      : { createdAt: -1 as const };

  const productsResult = await Product.find(filter).sort(sortDir).lean();

  const menProducts = productsResult.map((p: any) => ({
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
        title="Men's Collection"
        description="Discover our premium range of men's clothing. Designed for comfort, styled for everyday luxury. From oversized fits to minimalist essentials."
        products={menProducts}
      />
      <Footer />
    </main>
  );
}
