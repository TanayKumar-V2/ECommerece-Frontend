import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { Providers } from "@/components/Providers";
import ToastContainer from "@/components/ToastContainer";
import { Analytics } from "@vercel/analytics/next";

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
  icons: [{ rel: "icon", url: "/favicon.jpeg" }],
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
        <a className="skip-link" href="#main">Skip to content</a>
        <Providers>
          <SmoothScrollProvider>
            <div id="main">{children}</div>
            <ToastContainer />
          </SmoothScrollProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
