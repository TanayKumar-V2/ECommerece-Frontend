import type { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "https://viraasatclothing.store";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/men`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/women`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/cart`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/wishlist`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    await dbConnect();
    const products = await Product.find({}, { title: 1, category: 1, updatedAt: 1 })
      .sort({ updatedAt: -1 })
      .lean();

    productRoutes = products.map((product: any) => ({
      url: `${baseUrl}/${product.category.toLowerCase()}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Sitemap: Failed to fetch products", error);
  }

  return [...staticRoutes, ...productRoutes];
}
