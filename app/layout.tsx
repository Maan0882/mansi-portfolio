import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: "Mansi Gajjar | Full Stack Developer Portfolio",
  description:
    "Full Stack Developer portfolio — interactive API Explorer, SQL Playground, live dashboard and more. Next.js, Laravel, TypeScript, MySQL.",
  authors: [{ name: "Mansi Gajjar" }],
  keywords: [
    "Mansi Gajjar",
    "Full Stack Developer",
    "Next.js",
    "Laravel",
    "TypeScript",
    "API Explorer",
    "Portfolio",
  ],
  openGraph: {
    title: "Mansi Gajjar | Full Stack Developer",
    description: "Interactive dual-engine headless portfolio — API Explorer, Filament Dashboard, Live Guestbook & SQL Playground.",
    url: "https://mansi-portfolio-3d.vercel.app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mansi Gajjar | Full Stack Developer",
    description: "Interactive headless portfolio with API Explorer, Dashboard & more.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;600;700;900&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#09090b" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
