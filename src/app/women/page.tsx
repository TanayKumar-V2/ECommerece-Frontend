import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export default async function WomenPage({
  searchParams,
}: {
    searchParams: Promise<{ size?: string; sort?: string; minPrice?: string; maxPrice?: string; collection?: string; page?: string }>;
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

  const minPrice = Number(resolvedSearchParams.minPrice);
  const maxPrice = Number(resolvedSearchParams.maxPrice);
  if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
    filter.price = {};
    if (Number.isFinite(minPrice)) {
      filter.price.$gte = minPrice;
    }
    if (Number.isFinite(maxPrice)) {
      filter.price.$lte = maxPrice;
    }
  }

  if (resolvedSearchParams.collection) {
    const collectionTerm = resolvedSearchParams.collection.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { title: { $regex: collectionTerm, $options: 'i' } },
      { description: { $regex: collectionTerm, $options: 'i' } },
    ];
  }

  const page = Math.max(1, Number.parseInt(resolvedSearchParams.page || '1', 10) || 1);
  const pageSize = 48;
  const totalCount = await Product.countDocuments(filter);

  // Sort direction
  const sortDir =
    resolvedSearchParams.sort === "asc"
      ? { price: 1 as const }
      : resolvedSearchParams.sort === "desc"
      ? { price: -1 as const }
      : { createdAt: -1 as const };

  const productsResult = await Product.find(filter).sort(sortDir as any).skip((page - 1) * pageSize).limit(pageSize).lean();

  const womenProducts = productsResult.map((p: any) => ({
    id: p._id.toString(),
    name: p.title,
    price: p.price,
    image: p.images[0],
    images: p.images,
    category: (p.category.charAt(0).toUpperCase() +
      p.category.slice(1)) as "Men" | "Women" | "Unisex",
    colors: p.colors,
    sizes: p.sizes,
    description: p.description,
        stock: p.stock,
  }));

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <ProductGrid
        title="Women's Collection"
        description="Elegant, flowing, and cozy. Explore modern silhouettes rooted in traditional aesthetics, crafted for your daily wardrobe."
        products={womenProducts}
        totalCount={totalCount}
        currentPage={page}
        pageSize={pageSize}
      />
      <Footer />
    </main>
  );
}
