import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password | Viraasat",
  description: "Create a new password for your Viraasat account.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
