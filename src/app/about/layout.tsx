import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | Viraasat",
  description:
    "Discover the story behind Viraasat — a modern fashion brand rooted in Indian craft, tradition, and timeless style.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
