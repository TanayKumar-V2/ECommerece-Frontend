"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Notification from "@/models/Notification";
import { verifyAdmin } from "@/lib/authUtils";

/**
 * Create a new product
 */
export async function createProduct(formData: any) {
  await verifyAdmin();
  await dbConnect();

  try {
    const product = await Product.create({
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category.toLowerCase(),
      images: Array.isArray(formData.images) ? formData.images : [formData.images],
      sizes: typeof formData.sizes === 'string' ? formData.sizes.split(',').map((s: string) => s.trim()) : (formData.sizes || ["S", "M", "L", "XL", "XXL"]),
      colors: typeof formData.colors === 'string' ? formData.colors.split(',').map((c: string) => c.trim()) : (formData.colors || ["Black", "White"]),
      qikink_sku: formData.sku,
      qikinkFulfillmentMode: formData.qikinkFulfillmentMode || "catalog_design",
      stock: Number(formData.stock) || 0,
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath(`/${product.category}`);
    
    // Create Notification
    await Notification.create({
      title: "New Product Added",
      message: `${product.title} has been added to the store.`,
      type: "success"
    });
    
    return { success: true, product: JSON.parse(JSON.stringify(product)) };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, formData: any) {
  await verifyAdmin();
  await dbConnect();

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category.toLowerCase(),
        images: Array.isArray(formData.images) ? formData.images : [formData.images],
        sizes: typeof formData.sizes === 'string' ? formData.sizes.split(',').map((s: string) => s.trim()) : formData.sizes,
        colors: typeof formData.colors === 'string' ? formData.colors.split(',').map((c: string) => c.trim()) : formData.colors,
        qikink_sku: formData.sku,
        qikinkFulfillmentMode: formData.qikinkFulfillmentMode || "catalog_design",
        stock: Number(formData.stock) || 0,
      },
      { new: true }
    );

    if (!product) throw new Error("Product not found");

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath(`/${product.category}`);
    revalidatePath(`/product/${id}`);

    return { success: true, product: JSON.parse(JSON.stringify(product)) };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string) {
  await verifyAdmin();
  await dbConnect();

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error("Product not found");

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath(`/${product.category}`);

    // Create Notification
    await Notification.create({
      title: "Product Deleted",
      message: `${product.title} has been removed from the store.`,
      type: "warning"
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
}
