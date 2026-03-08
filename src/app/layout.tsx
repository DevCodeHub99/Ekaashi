import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import StructuredData, { organizationSchema, websiteSchema } from "@/components/seo/structured-data";
import AuthSessionProvider from "@/components/providers/session-provider";
import QueryProvider from "@/components/providers/query-provider";
import ServiceWorkerRegister from "@/components/service-worker-register";
import { WebVitals } from "@/components/web-vitals";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ekaashi-com.vercel.app'),
  title: {
    default: "Ekaashi - Exquisite Earrings, Necklaces & Jewelry Sets",
    template: "%s | Ekaashi"
  },
  description: "Discover Ekaashi's beautiful collection of handcrafted jewelry including party wear earrings, ethnic earrings, casual necklaces, and complete jewelry sets. Premium quality at affordable prices.",
  keywords: ["ekaashi", "jewelry", "earrings", "necklaces", "jewelry sets", "party wear earrings", "ethnic earrings", "casual earrings", "handcrafted jewelry", "online jewelry store", "buy jewelry online"],
  authors: [{ name: "Ekaashi" }],
  creator: "Ekaashi",
  publisher: "Ekaashi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Ekaashi",
    title: "Ekaashi - Exquisite Earrings, Necklaces & Jewelry Sets",
    description: "Discover Ekaashi's beautiful collection of handcrafted jewelry including party wear earrings, ethnic earrings, casual necklaces, and complete jewelry sets.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ekaashi Jewelry Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ekaashi - Exquisite Earrings, Necklaces & Jewelry Sets",
    description: "Discover Ekaashi's beautiful collection of handcrafted jewelry including party wear earrings, ethnic earrings, casual necklaces, and complete jewelry sets.",
    images: ["/og-image.jpg"],
    creator: "@ekaashi",
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
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
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
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#d97706" />
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Skip to main content link for keyboard users */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-amber-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
        >
          Skip to main content
        </a>
        
        <AuthSessionProvider>
          <QueryProvider>
            <CartProvider>
              <ToastProvider>
                <ServiceWorkerRegister />
                <WebVitals />
                <Header />
                <main id="main-content" className="flex-1 pt-14 sm:pt-16">
                  {children}
                </main>
                <Footer />
              </ToastProvider>
            </CartProvider>
          </QueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
