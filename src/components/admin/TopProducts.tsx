"use client"

import Image from 'next/image'

export default function TopProducts({ products }: { products?: any[] }) {
    if (!products || products.length === 0) return <div className="text-sm text-foreground/50">No products found.</div>;

    return (
        <div className="flex flex-col gap-4">
            {products.map((product) => (
                <div 
                    key={product.id} 
                    className="flex items-center gap-4 p-3 rounded-2xl border border-transparent"
                >
                    <div className="relative w-14 h-16 rounded-xl overflow-hidden shrink-0 bg-brand-cream/50 shadow-sm">
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
