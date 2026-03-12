"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, ChevronDown, PackageCheck, Clock, CheckCircle2, XCircle, Truck } from "lucide-react";
import { updateOrderStatus } from "@/actions/orderActions";

interface OrderType {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  products: {
    product: {
      title: string;
    };
    quantity: number;
    size: string;
    color: string;
  }[];
  totalAmount: number;
  status: string;
  shippingAddress: {
    phone: string;
  };
  createdAt: string;
}

const statusStyles = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
} as Record<string, string>;

export default function OrdersClient({ 
  initialOrders, 
  stats 
}: { 
  initialOrders: any[], 
  stats: { today: number, week: number, month: number } 
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // Optimistic update
    const previousOrders = [...orders];
    setOrders(orders.map(order => 
      order._id === orderId ? { ...order, status: newStatus } : order
    ));

    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (!res.success) {
        setOrders(previousOrders);
        alert(res.error || "Failed to update status");
      }
    } catch (err) {
      setOrders(previousOrders);
      alert("Something went wrong");
    }
  };

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-medium text-foreground">Order Management</h1>
          <p className="text-foreground/60 mt-1">Track, update, and manage customer orders.</p>
        </div>
      </div>

      {/* Orders Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-foreground/5 flex items-center justify-between group">
          <div>
            <p className="text-foreground/60 text-sm font-medium mb-1">Orders Today</p>
            <p className="text-3xl font-heading font-semibold text-foreground">{stats.today}</p>
          </div>
          <div className="p-4 bg-brand-cream/50 rounded-2xl group-hover:bg-brand-beige transition-colors duration-300">
            <Clock className="w-6 h-6 text-foreground/70" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl shadow-sm border border-foreground/5 flex items-center justify-between group">
          <div>
            <p className="text-foreground/60 text-sm font-medium mb-1">Orders This Week</p>
            <p className="text-3xl font-heading font-semibold text-foreground">{stats.week}</p>
          </div>
          <div className="p-4 bg-brand-cream/50 rounded-2xl group-hover:bg-brand-beige transition-colors duration-300">
            <Calendar className="w-6 h-6 text-foreground/70" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl shadow-sm border border-foreground/5 flex items-center justify-between group">
          <div>
            <p className="text-foreground/60 text-sm font-medium mb-1">Orders This Month</p>
            <p className="text-3xl font-heading font-semibold text-foreground">{stats.month}</p>
          </div>
          <div className="p-4 bg-brand-cream/50 rounded-2xl group-hover:bg-brand-beige transition-colors duration-300">
            <PackageCheck className="w-6 h-6 text-foreground/70" />
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-foreground/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input 
            type="text" 
            placeholder="Search orders by ID or customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige focus:border-transparent transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="px-4 py-2 bg-brand-cream/10 border border-brand-beige/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-beige">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Paid</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-foreground/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-foreground/10 bg-brand-cream/10 text-xs uppercase tracking-wider text-foreground/60">
                <th className="p-4 font-medium pl-6">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total Price</th>
                <th className="p-4 font-medium pr-6">Status Control</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={order._id} 
                  className="border-b border-foreground/5 hover:bg-brand-cream/10 transition-colors"
                >
                  <td className="p-4 pl-6 font-mono text-xs text-foreground uppercase">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-foreground font-medium">{order.user?.name || "Guest"}</p>
                    <p className="text-[10px] text-foreground/40">{order.user?.email || "No email"}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {order.products.map((item: any, idx: number) => (
                        <p key={idx} className="text-xs text-foreground/70">
                          {item.product?.title || "Item"} x {item.quantity} ({item.size})
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-semibold">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="p-4 pr-6">
                    <div className="relative inline-block w-32">
                      <select 
                        value={order.status.toLowerCase()}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`appearance-none w-full px-3 py-1.5 pr-8 rounded-lg text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors cursor-pointer capitalize ${statusStyles[order.status.toLowerCase()] || "bg-gray-50"}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
