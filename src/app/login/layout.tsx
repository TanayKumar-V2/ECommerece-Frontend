import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In | Viraasat",
  description: "Sign in to your Viraasat account to manage orders and more.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
