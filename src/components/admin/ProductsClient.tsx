"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { createProduct, updateProduct, deleteProduct } from "@/actions/productActions";

interface ProductType {
  _id: string;
  title: string;
  category: string;
  price: number;
  qikink_sku: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  stock: number;
}

export default function ProductsClient({ initialProducts }: { initialProducts: ProductType[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Men",
    price: "",
    sku: "",
    images: "",
    stock: "",
    colors: "Black, White",
    sizes: "S, M, L, XL, XXL",
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      category: "Men",
      price: "",
      sku: "",
      images: "",
      stock: "0",
      colors: "Black, White",
      sizes: "S, M, L, XL, XXL",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductType) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category.charAt(0).toUpperCase() + product.category.slice(1),
      price: product.price.toString(),
      sku: product.qikink_sku,
      images: product.images[0] || "",
      stock: (product.stock || 0).toString(),
      colors: product.colors?.join(", ") || "Black, White",
      sizes: product.sizes?.join(", ") || "S, M, L, XL, XXL",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct._id, formData);
        if (res.success) {
          setProducts(products.map(p => p._id === editingProduct._id ? res.product : p));
          setIsModalOpen(false);
        } else {
          alert(res.error || "Failed to update product");
        }
      } else {
        const res = await createProduct(formData);
        if (res.success) {
          setProducts([res.product, ...products]);
          setIsModalOpen(false);
        } else {
          alert(res.error || "Failed to create product");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        alert(res.error || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.qikink_sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-medium text-foreground">Products</h1>
          <p className="text-foreground/60 mt-1">Manage your store inventory and product catalog.</p>
        </div>
        <button 
          onClick={openAddModal}
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige focus:border-transparent transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-brand-cream/10 border border-brand-beige/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-beige"
          >
            <option value="">All Categories</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
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
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-foreground/40 text-sm">
                    No products match your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={product._id} 
                    className="border-b border-foreground/5 hover:bg-brand-cream/20 transition-colors group"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-brand-cream/50 shadow-sm shrink-0">
                          <Image 
                            src={product.images[0] || "/placeholder.jpg"} 
                            alt={product.title} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{product.title}</p>
                          <p className="text-xs text-foreground/50 truncate max-w-[200px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-foreground/80 capitalize">{product.category}</td>
                    <td className="p-4 text-sm font-medium">Rs. {product.price.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock || 0} left
                      </span>
                    </td>
                    <td className="p-4 text-sm text-foreground/60 font-mono tracking-tighter">{product.qikink_sku}</td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-2 text-foreground/60 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-foreground/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <form onSubmit={handleSubmit}>
                <div className="p-6 border-b flex-shrink-0 border-foreground/10 flex justify-between items-center bg-brand-cream/10 z-10 relative shadow-sm">
                  <h2 className="text-xl font-heading font-semibold text-foreground">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-foreground/50 hover:text-foreground transition-colors p-1 rounded-full hover:bg-foreground/5">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 h-full max-h-[60vh] md:max-h-[70vh] space-y-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-sm font-medium text-foreground/80 pl-1">Product Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-2.5 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige text-sm" 
                        placeholder="e.g. Vintage Denim Jacket" 
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-sm font-medium text-foreground/80 pl-1">Description</label>
                      <textarea 
                        rows={3} 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-4 py-2.5 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige text-sm resize-none" 
                        placeholder="Describe the product details..." 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground/80 pl-1">Category</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2.5 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige text-sm"
                      >
                        <option>Men</option>
                        <option>Women</option>
                        <option>Unisex</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground/80 pl-1">Price (Rs.)</label>
                      <input 
                        type="number" 
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-4 py-2.5 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige text-sm" 
                        placeholder="0.00" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground/80 pl-1">SKU (Qikink)</label>
                      <input 
                        type="text" 
                        required
                        value={formData.sku}
                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                        className="w-full px-4 py-2.5 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige text-sm" 
                        placeholder="e.g. M-JKT-001" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground/80 pl-1">Stock Quantity</label>
                      <input 
                        type="number" 
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="w-full px-4 py-2.5 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige text-sm" 
                        placeholder="0" 
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-sm font-medium text-foreground/80 pl-1">Image URL</label>
                      <input 
                        type="text" 
                        required
                        value={formData.images}
                        onChange={(e) => setFormData({...formData, images: e.target.value})}
                        className="w-full px-4 py-2.5 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige text-sm" 
                        placeholder="https://..." 
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-sm font-medium text-foreground/80 pl-1">Available Colors (comma separated)</label>
                      <input 
                        type="text" 
                        required
                        value={formData.colors}
                        onChange={(e) => setFormData({...formData, colors: e.target.value})}
                        className="w-full px-4 py-2.5 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige text-sm" 
                        placeholder="White, Black, Light Baby Pink" 
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-sm font-medium text-foreground/80 pl-1">Available Sizes (comma separated)</label>
                      <input 
                        type="text" 
                        required
                        value={formData.sizes}
                        onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                        className="w-full px-4 py-2.5 bg-brand-cream/10 border border-brand-beige/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-beige text-sm" 
                        placeholder="XS, S, M, L, XL" 
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t flex-shrink-0 border-foreground/10 bg-brand-cream/5 flex justify-end gap-3 z-10 relative shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-foreground/70 hover:text-foreground font-medium text-sm transition-colors rounded-xl hover:bg-foreground/5"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-foreground text-background rounded-xl text-sm font-medium hover:bg-foreground/90 shadow-sm hover:shadow transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingProduct ? "Update Product" : "Save Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
