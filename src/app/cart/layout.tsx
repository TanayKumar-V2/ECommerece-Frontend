import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shopping Cart | Viraasat",
  description: "Review your items and proceed to checkout.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
