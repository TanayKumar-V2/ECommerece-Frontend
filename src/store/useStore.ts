import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
    id: string
    name: string
    price: number
    image: string
    category: "Men" | "Women" | "Unisex"
}

interface CartItem extends Product {
    quantity: number
    size: "XS" | "S" | "M" | "L" | "XL" | "XXL"
}

interface AppState {
    cart: CartItem[]
    wishlist: Product[]
    recentlyViewed: Product[]
    addToCart: (item: CartItem) => void
    removeFromCart: (id: string, size: string) => void
    updateCartQuantity: (id: string, size: string, quantity: number) => void
    toggleWishlist: (item: Product) => void
    isInWishlist: (id: string) => boolean
    addRecentlyViewed: (item: Product) => void
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            cart: [],
            wishlist: [],
            recentlyViewed: [],

            addToCart: (item) => {
                const { cart } = get()
                const existingItemIndex = cart.findIndex((i) => i.id === item.id && i.size === item.size)
                if (existingItemIndex > -1) {
                    const newCart = [...cart]
                    newCart[existingItemIndex].quantity += item.quantity
                    set({ cart: newCart })
                } else {
                    set({ cart: [...cart, item] })
                }
            },

            removeFromCart: (id, size) => set((state) => ({
                cart: state.cart.filter((i) => !(i.id === id && i.size === size))
            })),

            updateCartQuantity: (id, size, quantity) => set((state) => ({
                cart: state.cart.map((item) =>
                    item.id === id && item.size === size ? { ...item, quantity } : item
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
            }
        }),
        {
            name: 'viraasat-storage',
        }
    )
)
