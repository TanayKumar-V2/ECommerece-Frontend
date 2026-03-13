import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientProfileWrapper from "@/components/ClientProfileWrapper";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await dbConnect();

  const orders = await Order.find({ user: (session.user as any).id })
    .sort({ createdAt: -1 })
    .populate({
      path: "products.product",
      model: "Product",
    })
    .lean();

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-150 h-150 rounded-full bg-brand-cream/40 blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-125 h-125 rounded-full bg-brand-beige/30 blur-[100px] translate-y-1/3" />
        <div className="absolute top-1/2 left-0 w-75 h-75 rounded-full bg-brand-cream/20 blur-[80px]" />
      </div>

      {/* Subtle diagonal grid pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#3B2F2F 1px, transparent 1px), linear-gradient(90deg, #3B2F2F 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <Navbar />

      <div className="relative z-10 container-custom pt-32 pb-20">
        <ClientProfileWrapper
          user={session.user}
          orders={JSON.parse(JSON.stringify(orders))}
        />
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}
