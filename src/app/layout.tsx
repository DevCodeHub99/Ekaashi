import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import StructuredData, { organizationSchema, websiteSchema } from "@/components/seo/structured-data";
import AuthSessionProvider from "@/components/providers/session-provider";
import { CartProvider } from "@/contexts/cart-context";
import { ToastProvider } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ekaashi - Exquisite Earrings, Necklaces & Jewelry Sets",
  description: "Discover Ekaashi's beautiful collection of handcrafted jewelry including party wear earrings, ethnic earrings, casual necklaces, and complete jewelry sets. Premium quality at affordable prices.",
  keywords: "ekaashi, jewelry, earrings, necklaces, jewelry sets, party wear earrings, ethnic earrings, casual earrings, handcrafted jewelry",
  openGraph: {
    title: "Ekaashi - Exquisite Earrings, Necklaces & Jewelry Sets",
    description: "Discover Ekaashi's beautiful collection of handcrafted jewelry including party wear earrings, ethnic earrings, casual necklaces, and complete jewelry sets.",
    type: "website",
    siteName: "Ekaashi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ekaashi - Exquisite Earrings, Necklaces & Jewelry Sets",
    description: "Discover Ekaashi's beautiful collection of handcrafted jewelry including party wear earrings, ethnic earrings, casual necklaces, and complete jewelry sets.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthSessionProvider>
          <CartProvider>
            <ToastProvider>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
