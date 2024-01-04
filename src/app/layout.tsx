import "./globals.css";
import type { Metadata } from "next";

import { Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

import Providers from "@/app/providers/provider.component";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "BE1 Tecnologia",
  description: "Qualidade de vida no campo!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
