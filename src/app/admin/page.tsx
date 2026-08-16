import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import DashboardClient from "@/components/admin/DashboardClient";
import { verifyAdmin } from "@/lib/authUtils";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    await verifyAdmin();
    await dbConnect();

    // 1. Total Revenue
    const revenueResult = await Order.aggregate([
        { $match: { status: { $in: ["paid", "processing", "shipped", "delivered"] } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // 2. Total Orders
    const totalOrders = await Order.countDocuments();

    // 3. Active Products
    const activeProducts = await Product.countDocuments();

    // 4. Total Customers
    const totalCustomers = await User.countDocuments({ role: "user" });

    // 5. Monthly Revenue Data
    const currentYear = new Date().getFullYear();
    const monthlyRevenueRaw = await Order.aggregate([
        { $match: { status: { $in: ["paid", "processing", "shipped", "delivered"] }, createdAt: { $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`) } } },
        { $group: { _id: { $month: "$createdAt" }, revenue: { $sum: "$totalAmount" } } },
        { $sort: { _id: 1 } },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = monthlyRevenueRaw.map((item) => ({
        name: monthNames[item._id - 1],
        revenue: item.revenue,
    }));

    const fullYearData = monthNames.map((name) => {
        const existing = chartData.find((d) => d.name === name);
        return existing || { name, revenue: 0 };
    });

    // 6. Catalog snapshot. Sales attribution is not available in the current order model,
    // so the dashboard does not present invented sales or revenue values.
    const topProductsRaw = await Product.find({}).limit(4).lean() as any[];
    const topProducts = topProductsRaw.map((product) => ({
        id: product._id.toString(),
        name: product.title,
        image: product.images && product.images.length > 0 ? product.images[0] : "/placeholder.jpg",
        price: product.price,
        stock: product.stock,
    }));

    const attentionOrdersRaw = await Order.find({
        $or: [
            { qikinkLastError: { $exists: true, $nin: [null, ""] } },
            { status: "pending" },
        ],
    }).sort({ createdAt: -1 }).limit(6).lean() as any[];
    const attentionItems = attentionOrdersRaw.map((order) => ({
        id: order._id.toString(),
        label: order.qikinkLastError ? "Fulfillment failed" : "Payment pending",
        detail: order.qikinkLastError || `Order #${order._id.toString().slice(-8).toUpperCase()} needs review`,
        href: "/admin/orders",
        tone: order.qikinkLastError ? "error" as const : "warning" as const,
    }));

    const analyticsData = [
        {
            title: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString('en-IN')}`,
            subtitle: "From completed orders",
            trend: "Current total",
            color: "bg-orange-50 text-orange-600"
        },
        {
            title: "Total Orders",
            value: totalOrders.toString(),
            subtitle: "All orders received",
            trend: "All statuses",
            color: "bg-blue-50 text-blue-600"
        },
        {
            title: "Active Products",
            value: activeProducts.toString(),
            subtitle: "Products currently available",
            trend: "Catalog count",
            color: "bg-emerald-50 text-emerald-600"
        },
        {
            title: "Total Customers",
            value: totalCustomers.toString(),
            subtitle: "Registered accounts",
            trend: "Registered accounts",
            color: "bg-purple-50 text-purple-600"
        }
    ];

    return (
        <DashboardClient 
            analyticsData={analyticsData} 
            revenueData={fullYearData}
            topProducts={topProducts}
            attentionItems={attentionItems}
        />
    );
}
