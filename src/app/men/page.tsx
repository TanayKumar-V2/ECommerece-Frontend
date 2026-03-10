import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { DUMMY_PRODUCTS } from "@/data/products";

export default function MenPage() {
    const menProducts = DUMMY_PRODUCTS.filter(p => p.category === 'Men' || p.category === 'Unisex');

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <ProductGrid
                title="Men's Collection"
                description="Discover our premium range of men's clothing. Designed for comfort, styled for everyday luxury. From oversized fits to minimalist essentials."
                products={menProducts}
            />
            <Footer />
        </main>
    );
}
