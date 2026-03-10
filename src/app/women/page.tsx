import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { DUMMY_PRODUCTS } from "@/data/products";

export default function WomenPage() {
    const womenProducts = DUMMY_PRODUCTS.filter(p => p.category === 'Women' || p.category === 'Unisex');

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <ProductGrid
                title="Women's Collection"
                description="Elegant, flowing, and cozy. Explore modern silhouettes rooted in traditional aesthetics, crafted for your daily wardrobe."
                products={womenProducts}
            />
            <Footer />
        </main>
    );
}
