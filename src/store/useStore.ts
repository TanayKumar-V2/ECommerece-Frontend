import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
    id: string
    name: string
    price: number
    image: string
    category: "Men" | "Women" | "Unisex"
    sizes?: string[]
    colors?: string[]
}

export interface CartItem extends Product {
    quantity: number
    size: "XS" | "S" | "M" | "L" | "XL" | "XXL" | string
    color: string
}

interface AppState {
    cart: CartItem[]
    wishlist: Product[]
    recentlyViewed: Product[]
    addToCart: (item: CartItem) => void
    removeFromCart: (id: string, size: string, color: string) => void
    updateCartQuantity: (id: string, size: string, color: string, quantity: number) => void
    toggleWishlist: (item: Product) => void
    isInWishlist: (id: string) => boolean
    addRecentlyViewed: (item: Product) => void
    clearCart: () => void
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            cart: [],
            wishlist: [],
            recentlyViewed: [],

            addToCart: (item) => {
                const { cart } = get()
                const existingItemIndex = cart.findIndex((i) => i.id === item.id && i.size === item.size && i.color === item.color)
                if (existingItemIndex > -1) {
                    const newCart = [...cart]
                    newCart[existingItemIndex].quantity += item.quantity
                    set({ cart: newCart })
                } else {
                    set({ cart: [...cart, item] })
                }
            },

            removeFromCart: (id, size, color) => set((state) => ({
                cart: state.cart.filter((i) => !(i.id === id && i.size === size && i.color === color))
            })),

            updateCartQuantity: (id, size, color, quantity) => set((state) => ({
                cart: state.cart.map((item) =>
                    item.id === id && item.size === size && item.color === color ? { ...item, quantity } : item
                )
            })),

            toggleWishlist: (item) => {
                const { wishlist } = get()
                const exists = wishlist.some((w) => w.id === item.id)
                if (exists) {
                    set({ wishlist: wishlist.filter((w) => w.id !== item.id) })
                } else {
                    set({ wishlist: [...wishlist, item] })
                }
            },

            isInWishlist: (id) => get().wishlist.some((w) => w.id === id),

            addRecentlyViewed: (item) => {
                const { recentlyViewed } = get()
                // Remove existing if it's there to bring it to the front
                const filtered = recentlyViewed.filter((p) => p.id !== item.id)
                // Add to start of array, keep max 10
                set({ recentlyViewed: [item, ...filtered].slice(0, 10) })
            },

            clearCart: () => set({ cart: [] })
        }),
        {
            name: 'viraasat-storage',
        }
    )
)
