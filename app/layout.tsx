import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Mansi Gajjar | Portfolio",
  description:
    "Portfolio of Mansi Gajjar, an aspiring Full Stack Developer specializing in creating interactive experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
