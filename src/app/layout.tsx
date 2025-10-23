import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CloudCrew Academy - Urban Cloud Engineering",
  description: "Modern cloud engineering education for urban youth and professionals. Learn AWS, serverless, and cloud architecture with hands-on projects.",
  keywords: ["cloud engineering", "AWS", "serverless", "urban education", "technology careers"],
  authors: [{ name: "CloudCrew Academy" }],
  creator: "CloudCrew Academy",
  publisher: "CloudCrew Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://cloudcrew-academy.com"),
  openGraph: {
    title: "CloudCrew Academy - Urban Cloud Engineering",
    description: "Modern cloud engineering education for urban youth and professionals",
    url: "https://cloudcrew-academy.com",
    siteName: "CloudCrew Academy",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CloudCrew Academy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CloudCrew Academy - Urban Cloud Engineering",
    description: "Modern cloud engineering education for urban youth and professionals",
    images: ["/og-image.jpg"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CloudCrew Academy",
  },
  applicationName: "CloudCrew Academy",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "msapplication-TileColor": "#1e293b",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#1e293b",
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#1e293b',
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-dark-bg-primary">
        <ErrorBoundary>
          <Providers>
            <div className="min-h-screen bg-gradient-to-br from-dark-bg-primary via-dark-bg-secondary to-dark-bg-tertiary">
              {children}
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}