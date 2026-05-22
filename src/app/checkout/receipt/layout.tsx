import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Order Receipt | Viraasat",
  description: "View and print your order receipt.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
