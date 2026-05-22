import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | Viraasat",
  description: "Get in touch with the Viraasat team. We'd love to hear from you.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
