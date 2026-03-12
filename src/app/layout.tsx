import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Viraasat | Wear Your Culture",
  description: "Modern fashion rooted in tradition. Premium clothing brand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased selection:bg-brand-beige selection:text-foreground`}
        suppressHydrationWarning
      >
        <Providers>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </Providers>
      </body>
    </html>
  );
}
