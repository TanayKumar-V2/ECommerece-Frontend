"use client"

import Image from 'next/image'

const topProducts = [
    {
        id: "vr-001",
        name: "Cyberpunk Oversized Tee",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?fit=crop&w=400&q=80",
        sales: 58,
        revenue: 86942
    },
    {
        id: "vr-002",
        name: "Street Ninja Cargo Pants",
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?fit=crop&w=400&q=80",
        sales: 41,
        revenue: 102459
    },
    {
        id: "vr-003",
        name: "Glitch Art Hoodie",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?fit=crop&w=400&q=80",
        sales: 36,
        revenue: 93564
    },
    {
        id: "vr-004",
        name: "Minimalist Beige Turtle",
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?fit=crop&w=400&q=80",
        sales: 29,
        revenue: 43471
    }
]

export default function TopProducts() {
    return (
        <div className="flex flex-col gap-4">
            {topProducts.map((product) => (
                <div 
                    key={product.id} 
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-brand-cream/30 transition-colors group cursor-pointer border border-transparent hover:border-foreground/5"
                >
                    <div className="relative w-14 h-16 rounded-xl overflow-hidden shrink-0 bg-brand-cream/50 shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <Image 
                            src={product.image} 
                            alt={product.name} 
                            fill 
                            className="object-cover"
                        />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground truncate">{product.name}</h4>
                        <p className="text-xs text-foreground/50 mt-0.5">{product.sales} sales</p>
                    </div>
                    
                    <div className="text-right shrink-0">
                        <p className="font-heading font-semibold text-foreground">Rs. {product.revenue.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
