import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Same self-hosted font as apps/site (see its global.css for why: Fontshare's
// hosted CSS API is missing the 600 weight this design needs).
const satoshi = localFont({
  variable: "--font-satoshi",
  src: [
    { path: "../assets/fonts/satoshi-variable.woff2" },
    { path: "../assets/fonts/satoshi-variable.woff" },
  ],
  weight: "300 900",
});

export const metadata: Metadata = {
  title: "HelloWale Dashboard",
  description: "Customer points administration for HelloWale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
