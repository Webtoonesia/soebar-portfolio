import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://soebardesign.com"), // Ganti dengan domain kamu nanti
  title: {
    default: "Soebar Design | Premium Motion Graphics & HTML Widgets",
    template: "%s | Soebar Design",
  },
  description:
    "Discover premium motion graphics, HTML widgets, typography animations, WordPress assets, and creative design resources by Soebar Design.",

  keywords: [
    "Motion Graphics",
    "HTML Widgets",
    "WordPress Widgets",
    "Typography Animation",
    "Adobe Stock",
    "Creative Assets",
    "UI Animation",
    "4K Motion Graphics",
    "Soebar Design",
  ],

  authors: [
    {
      name: "Soebar Design",
    },
  ],

  creator: "Soebar Design",
  publisher: "Soebar Design",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Soebar Design",
    title: "Soebar Design | Premium Motion Graphics & HTML Widgets",
    description:
      "Premium Motion Graphics, HTML Widgets, WordPress Templates, Typography Animation, and Creative Assets.",
    url: "https://soebardesign.com", // Ganti nanti
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Soebar Design",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Soebar Design",
    description:
      "Premium Motion Graphics & HTML Widgets.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}