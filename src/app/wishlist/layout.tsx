import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Wishlist | Viraasat",
  description: "Your saved items — ready when you are.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
