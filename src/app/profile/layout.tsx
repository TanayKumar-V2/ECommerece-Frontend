import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Account | Viraasat",
  description: "Manage your Viraasat account, view orders, and update your profile.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
