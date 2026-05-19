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
    const monthlyRevenueRaw = await Order.aggregate([
        { $match: { status: { $in: ["paid", "processing", "shipped", "delivered"] } } },
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

    // 6. Top Products (Just fetching a few products as an example)
    const topProductsRaw = await Product.find({}).limit(4).lean() as any[];
    const topProducts = topProductsRaw.map((product) => ({
        id: product._id.toString(),
        name: product.title,
        image: product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/400",
        sales: Math.floor(Math.random() * 50) + 10, // Mock sales count for now
        revenue: Math.floor(Math.random() * 50000) + 10000 // Mock revenue for now
    }));

    const analyticsData = [
        {
            title: "Total Revenue",
            value: `Rs. ${totalRevenue.toLocaleString('en-IN')}`,
            subtitle: "From completed orders",
            trend: "+0%", // To be implemented
            color: "bg-orange-50 text-orange-600"
        },
        {
            title: "Total Orders",
            value: totalOrders.toString(),
            subtitle: "All orders received",
            trend: "+0%",
            color: "bg-blue-50 text-blue-600"
        },
        {
            title: "Active Products",
            value: activeProducts.toString(),
            subtitle: "Products currently available",
            trend: "+0",
            color: "bg-emerald-50 text-emerald-600"
        },
        {
            title: "Total Customers",
            value: totalCustomers.toString(),
            subtitle: "Registered accounts",
            trend: "+0%",
            color: "bg-purple-50 text-purple-600"
        }
    ];

    return (
        <DashboardClient 
            analyticsData={analyticsData} 
            revenueData={fullYearData}
            topProducts={topProducts}
        />
    );
}
