import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import ProductsClient from "@/components/admin/ProductsClient";
import { verifyAdmin } from "@/lib/authUtils";

export default async function ProductsPage() {
  await verifyAdmin();
  await dbConnect();

  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  return <ProductsClient initialProducts={JSON.parse(JSON.stringify(products))} />;
}
