"use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootProviders from "@/components/providers/RootProviders";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import Provider from "@/components/providers/Provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [title, setTitle] = useState("RP2P Geoportal");

  useEffect(() => {
    const generateTitle = () => {
      if (pathname === "/") return "RP2P Geoportal";
      return "RP2P Geoportal";
    };
    setTitle(generateTitle());
  }, [pathname]);

  const metadata: Metadata = {
    icons: {
      icon: '/favicon.ico',
    },
    title,
  };

  return (
    <Provider>
      <html
        lang="en"
        className="dark"
        style={{
          colorScheme: "dark",
        }}
      >
        <head>
          <title>{title}</title>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body className={inter.className}>
          <Toaster />
          <RootProviders>{children}</RootProviders>
        </body>
      </html>
    </Provider>
  );
}
