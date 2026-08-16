import { notFound } from "next/navigation"
import dbConnect from "@/lib/db"
import Product from "@/models/Product"
import ProductDetailClient from "@/components/ProductDetailClient"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  await dbConnect()
  const { id } = await params
  const product = await Product.findById(id).lean() as any
  if (!product) notFound()
  return <ProductDetailClient product={{ id: product._id.toString(), name: product.title, price: product.price, image: product.images?.[0] || "/placeholder.jpg", images: product.images, description: product.description, category: product.category.charAt(0).toUpperCase() + product.category.slice(1), colors: product.colors, sizes: product.sizes, stock: product.stock }} />
}
