import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import OrdersClient from "@/components/admin/OrdersClient";
import { verifyAdmin } from "@/lib/authUtils";

export default async function OrdersPage() {
  await verifyAdmin();
  await dbConnect();

  // Fetch orders with population
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .populate({ path: "user", model: "User", select: "name email phone" })
    .populate({ path: "products.product", model: "Product" })
    .lean();

  // Calculate stats
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(now.setDate(now.getDate() - 7));
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const ordersToday = await Order.countDocuments({ createdAt: { $gte: today } });
  const ordersThisWeek = await Order.countDocuments({ createdAt: { $gte: thisWeek } });
  const ordersThisMonth = await Order.countDocuments({ createdAt: { $gte: thisMonth } });

  const stats = {
    today: ordersToday,
    week: ordersThisWeek,
    month: ordersThisMonth,
  };

  return (
    <OrdersClient 
      initialOrders={JSON.parse(JSON.stringify(orders))} 
      stats={stats} 
    />
  );
}
