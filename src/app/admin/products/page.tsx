"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

// Mock Data
const initialProducts = [
    { id: '1', name: 'Cyberpunk Oversized Tee', category: 'Men', type: 'Oversized', price: 1499, sku: 'M-TEE-001', stock: 45, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?fit=crop&w=400&q=80' },
    { id: '2', name: 'Street Ninja Cargo Pants', category: 'Men', type: 'Casual', price: 2499, sku: 'M-PNT-042', stock: 12, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?fit=crop&w=400&q=80' },
    { id: '3', name: 'Glitch Art Hoodie', category: 'Unisex', type: 'Oversized', price: 2899, sku: 'U-HD-003', stock: 0, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?fit=crop&w=400&q=80' },
    { id: '4', name: 'Minimalist Beige Turtle', category: 'Women', type: 'Slim Fit', price: 1299, sku: 'W-TOP-019', stock: 128, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?fit=crop&w=400&q=80' },
]

export default function ProductsPage() {
    const [products, setProducts] = useState(initialProducts)
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-medium text-foreground">Products</h1>
                    <p className="text-foreground/60 mt-1">Manage your store inventory and product catalog.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 bg-foreground text-background rounded-xl text-sm font-medium hover:bg-foreground/90 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add New Product
                </button>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-foreground/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        className="w-full pl-9 pr-4 py-2 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige focus:border-transparent transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <select className="px-4 py-2 bg-brand-cream/10 border border-brand-beige/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-beige">
                        <option>All Categories</option>
                        <option>Men</option>
                        <option>Women</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-foreground/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-foreground/10 bg-brand-cream/10 text-xs uppercase tracking-wider text-foreground/60">
                                <th className="p-4 font-medium pl-6">Product</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium">SKU</th>
                                <th className="p-4 font-medium">Stock</th>
                                <th className="p-4 font-medium text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <motion.tr 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    key={product.id} 
                                    className="border-b border-foreground/5 hover:bg-brand-cream/20 transition-colors group"
                                >
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-brand-cream/50 shadow-sm shrink-0">
                                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground text-sm">{product.name}</p>
                                                <p className="text-xs text-foreground/50">{product.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-foreground/80">{product.category}</td>
                                    <td className="p-4 text-sm font-medium">Rs. {product.price.toLocaleString('en-IN')}</td>
                                    <td className="p-4 text-sm text-foreground/60">{product.sku}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            product.stock > 20 ? 'bg-emerald-50 text-emerald-700' : 
                                            product.stock > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                                        }`}>
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-foreground/60 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-foreground/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Product Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="p-6 border-b flex-shrink-0 border-foreground/10 flex justify-between items-center bg-brand-cream/10 z-10 relative shadow-sm">
                            <h2 className="text-xl font-heading font-semibold text-foreground">Add New Product</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-foreground/50 hover:text-foreground transition-colors p-1 rounded-full hover:bg-foreground/5">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 h-full max-h-[60vh] md:max-h-[70vh] space-y-6">
                            {/* Image Upload */}
                            <div className="flex justify-center">
                                <div className="w-32 h-40 border-2 border-dashed border-brand-beige/80 rounded-2xl flex flex-col items-center justify-center text-foreground/40 hover:text-brand-beige hover:border-brand-beige hover:bg-brand-cream/10 transition-colors cursor-pointer bg-brand-cream/5">
                                    <ImageIcon className="w-8 h-8 mb-2" />
                                    <span className="text-xs font-medium">Upload Image</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-foreground/80 pl-1">Product Name</label>
                                    <input type="text" className="w-full px-4 py-2.5 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige text-sm" placeholder="e.g. Vintage Denim Jacket" />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-foreground/80 pl-1">Description</label>
                                    <textarea rows={3} className="w-full px-4 py-2.5 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige text-sm resize-none" placeholder="Describe the product details, material, and care instructions..." />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground/80 pl-1">Category</label>
                                    <select className="w-full px-4 py-2.5 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige text-sm">
                                        <option>Men</option>
                                        <option>Women</option>
                                        <option>Unisex</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground/80 pl-1">Product Type</label>
                                    <select className="w-full px-4 py-2.5 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige text-sm">
                                        <option>Oversized</option>
                                        <option>Slim Fit</option>
                                        <option>Printed</option>
                                        <option>Casual</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5 border-t border-foreground/5 md:border-none pt-4 md:pt-0">
                                    <label className="text-sm font-medium text-foreground/80 pl-1">Price (Rs.)</label>
                                    <input type="number" className="w-full px-4 py-2.5 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige text-sm" placeholder="0.00" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground/80 pl-1">Stock Quantity</label>
                                    <input type="number" className="w-full px-4 py-2.5 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige text-sm" placeholder="0" />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-foreground/80 pl-1">SKU</label>
                                    <input type="text" className="w-full px-4 py-2.5 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige text-sm" placeholder="e.g. M-JKT-001" />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t flex-shrink-0 border-foreground/10 bg-brand-cream/5 flex justify-end gap-3 z-10 relative shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 text-foreground/70 hover:text-foreground font-medium text-sm transition-colors rounded-xl hover:bg-foreground/5"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 bg-foreground text-background rounded-xl text-sm font-medium hover:bg-foreground/90 shadow-sm hover:shadow transition-all hover:-translate-y-0.5"
                            >
                                Save Product
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
