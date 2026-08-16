"use client"

import Image from 'next/image'

export default function TopProducts({ products }: { products?: any[] }) {
    if (!products || products.length === 0) return <div className="text-sm text-foreground/50">No products found.</div>;

    return (
        <div className="flex flex-col gap-4">
            {products.map((product) => (
                <div 
                    key={product.id} 
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-brand-cream/30 transition-colors group cursor-pointer border border-transparent hover:border-foreground/5"
                >
                    <div className="relative w-14 h-16 rounded-xl overflow-hidden shrink-0 bg-brand-cream/50 shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <Image 
                            src={product.image} 
                            alt={product.name} 
                            fill 
                            sizes="56px"
                            className="object-cover"
                        />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground truncate">{product.name}</h4>
                        <p className="text-xs text-foreground/60 mt-0.5">{product.stock ?? 0} in stock</p>
                    </div>
                    
                    <div className="text-right shrink-0">
                        <p className="font-heading font-semibold text-foreground">₹{product.price.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
