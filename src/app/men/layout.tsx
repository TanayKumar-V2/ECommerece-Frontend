import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Men's Collection | Viraasat",
  description:
    "Explore Viraasat's men's collection — modern fashion rooted in tradition. Premium fabrics, timeless designs.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
