"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { verifyAdmin } from "@/lib/authUtils";

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: string) {
  await verifyAdmin();
  await dbConnect();

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) throw new Error("Order not found");

    revalidatePath("/admin/orders");
    revalidatePath("/profile");

    return { success: true, order: JSON.parse(JSON.stringify(order)) };
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }
}
