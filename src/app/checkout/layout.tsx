import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout | Viraasat",
  description: "Complete your order with secure payment.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
