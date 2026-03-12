"use client";

import { motion } from "framer-motion";
import SignOutButton from "./SignOutButton";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  Calendar,
  Tag,
  Star,
  Sparkles,
  ArrowRight,
  IndianRupee,
} from "lucide-react";

interface OrderProduct {
  product: {
    title: string;
    images: string[];
  };
  quantity: number;
  size: string;
  color: string;
}

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  products: OrderProduct[];
}

const STATUS_STYLES: Record<
  string,
  { label: string; className: string; dot: string }
> = {
  paid: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-50   text-blue-700   border-blue-200",
    dot: "bg-blue-500",
  },
  shipped: {
    label: "Shipped",
    className: "bg-violet-50  text-violet-700 border-violet-200",
    dot: "bg-violet-500",
  },
  delivered: {
    label: "Delivered",
    className: "bg-teal-50   text-teal-700   border-teal-200",
    dot: "bg-teal-500",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50    text-red-600    border-red-200",
    dot: "bg-red-400",
  },
};

function getStatusStyle(status: string) {
  return (
    STATUS_STYLES[status.toLowerCase()] ?? {
      label: status,
      className: "bg-brand-cream text-foreground border-brand-beige",
      dot: "bg-foreground/40",
    }
  );
}

/* ─── tiny helpers ─────────────────────────────────────────────────────────── */

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-5 text-center">
      <span className="text-2xl md:text-3xl font-heading font-bold text-foreground leading-none">
        {value}
      </span>
      <span className="mt-1.5 text-[9px] uppercase tracking-[0.25em] font-bold text-foreground/45">
        {label}
      </span>
    </div>
  );
}

/* ─── main component ────────────────────────────────────────────────────────── */

export default function ClientProfileWrapper({
  user,
  orders,
}: {
  user: any;
  orders: Order[];
}) {
  const totalSpent = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalItems = orders.reduce(
    (acc, o) => acc + o.products.reduce((a, p) => a + p.quantity, 0),
    0,
  );
  const initials =
    (user.name as string | undefined)
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ── Hero Card ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2.5rem] shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, #F5E6DA 0%, #EED9C4 50%, #E8CCAE 100%)",
        }}
      >
        {/* ── Decorative layer ── */}
        <div className="pointer-events-none absolute inset-0">
          {/* large soft circle – top-right */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/25 blur-3xl" />
          {/* medium circle – bottom-left */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-foreground/5 blur-2xl" />
          {/* ring accents */}
          <div className="absolute top-10 right-1/3 w-24 h-24 rounded-full border border-white/30" />
          <div className="absolute top-4  right-1/4 w-12 h-12 rounded-full border border-white/20" />
          <div className="absolute bottom-6 right-12  w-16 h-16 rounded-full border border-foreground/10" />
          {/* diagonal crosshatch */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg,#3B2F2F 0,#3B2F2F 1px,transparent 1px,transparent 18px)",
              backgroundSize: "26px 26px",
            }}
          />
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center md:items-end gap-8">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="relative shrink-0"
          >
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-background shadow-2xl flex items-center justify-center ring-4 ring-white/70 ring-offset-4 ring-offset-brand-cream/60">
              <span className="text-4xl md:text-5xl font-heading font-bold text-foreground/60 select-none">
                {initials}
              </span>
            </div>
            {/* badge */}
            <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-foreground rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
              <Star className="w-4 h-4 text-background fill-background" />
            </div>
          </motion.div>

          {/* Name / email */}
          <div className="flex-1 text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] uppercase tracking-[0.3em] text-foreground/50 font-bold mb-1 flex items-center gap-1 justify-center md:justify-start"
            >
              <Sparkles className="w-3 h-3" /> Viraasat Member
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-3xl md:text-5xl font-heading font-bold text-foreground leading-tight mb-2"
            >
              {user.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42 }}
              className="text-foreground/55 text-sm"
            >
              {user.email}
            </motion.p>
          </div>

          {/* Sign-out */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="shrink-0"
          >
            <SignOutButton />
          </motion.div>
        </div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 grid grid-cols-3 divide-x divide-foreground/10 border-t border-foreground/10 bg-white/30 backdrop-blur-sm"
        >
          <StatBlock value={String(orders.length)} label="Orders Placed" />
          <StatBlock
            value={`₹${totalSpent.toLocaleString("en-IN")}`}
            label="Total Spent"
          />
          <StatBlock value={String(totalItems)} label="Items Bought" />
        </motion.div>
      </motion.div>

      {/* ── Order History ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="flex items-center gap-3"
      >
        <div className="w-9 h-9 bg-foreground rounded-2xl flex items-center justify-center shadow-md">
          <ShoppingBag className="w-4 h-4 text-background" />
        </div>
        <h2 className="text-2xl font-heading font-bold">Order History</h2>
        <span className="ml-auto text-sm font-semibold text-foreground/35">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </motion.div>

      {orders.length === 0 ? (
        /* ── Empty State ─────────────────────────────────────────────────── */
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-4xl border-2 border-dashed border-brand-beige/60 p-16 text-center shadow-sm"
        >
          <div className="w-20 h-20 bg-brand-cream rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShoppingBag className="w-9 h-9 text-brand-beige" />
          </div>
          <h3 className="font-heading text-2xl font-semibold mb-2 text-foreground">
            No orders yet
          </h3>
          <p className="text-foreground/40 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
            You haven&apos;t placed any orders yet. Explore our collection and
            find something you love.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-foreground text-background px-10 py-3.5 rounded-2xl font-semibold text-sm hover:bg-foreground/85 transition-all hover:scale-105 shadow-lg"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        /* ── Order Cards ─────────────────────────────────────────────────── */
        <div className="space-y-5">
          {orders.map((order, index) => {
            const s = getStatusStyle(order.status);
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.6 + index * 0.07,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-white rounded-[1.75rem] shadow-md border border-foreground/6 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
              >
                {/* ── Order header ── */}
                <div className="relative overflow-hidden">
                  {/* subtle gradient strip */}
                  <div className="absolute inset-0 bg-linear-to-r from-brand-cream/40 via-brand-cream/20 to-transparent pointer-events-none" />

                  <div className="relative p-6 flex flex-wrap items-center justify-between gap-4">
                    {/* Meta pills */}
                    <div className="flex flex-wrap items-center gap-5">
                      {/* Order ID */}
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.22em] text-foreground/40 font-bold flex items-center gap-1 mb-1">
                          <Tag className="w-2.5 h-2.5" /> Order
                        </p>
                        <p className="text-sm font-bold font-mono tracking-wide text-foreground">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>

                      <div className="w-px h-7 bg-foreground/10 hidden sm:block" />

                      {/* Date */}
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.22em] text-foreground/40 font-bold flex items-center gap-1 mb-1">
                          <Calendar className="w-2.5 h-2.5" /> Date
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      <div className="w-px h-7 bg-foreground/10 hidden sm:block" />

                      {/* Status */}
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.22em] text-foreground/40 font-bold flex items-center gap-1 mb-1">
                          <Package className="w-2.5 h-2.5" /> Status
                        </p>
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${s.className}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
                          />
                          {s.label}
                        </span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center gap-2 bg-brand-cream/50 border border-brand-beige/60 rounded-2xl px-5 py-3">
                      <IndianRupee className="w-4 h-4 text-foreground/50" />
                      <span className="text-xl font-heading font-bold text-foreground">
                        {order.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Divider ── */}
                <div className="mx-6 border-t border-dashed border-foreground/[0.07]" />

                {/* ── Products ── */}
                <div className="p-6 space-y-3">
                  {order.products.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.65 + index * 0.07 + idx * 0.04 }}
                      className="flex items-center gap-4 bg-brand-cream/20 hover:bg-brand-cream/40 rounded-2xl p-3.5 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-14 h-18 rounded-xl overflow-hidden shrink-0 bg-brand-cream shadow-sm ring-1 ring-foreground/6">
                        {item.product?.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product?.title ?? "Product"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-foreground/25" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate mb-2 leading-tight">
                          {item.product?.title ?? "Product"}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <Pill label={`Size ${item.size}`} />
                          <Pill label={`Qty ${item.quantity}`} />
                          {item.color && <Pill label={item.color} />}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="text-[10px] bg-background border border-foreground/10 px-2.5 py-0.5 rounded-full font-semibold text-foreground/55 tracking-wide">
      {label}
    </span>
  );
}
