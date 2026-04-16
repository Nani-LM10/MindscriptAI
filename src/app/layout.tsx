if (typeof window === 'undefined') {
  try {
    if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.localStorage.getItem !== 'function') {
      (globalThis as any).localStorage = {
        getItem: () => null,
        setItem: () => { },
        removeItem: () => { },
        clear: () => { },
        key: () => null,
        length: 0,
      };
    }
  } catch (e) {
    // In some Node versions, accessing localStorage might throw if not enabled
    (globalThis as any).localStorage = {
      getItem: () => null,
      setItem: () => { },
      removeItem: () => { },
      clear: () => { },
      key: () => null,
      length: 0,
    };
  }
}

import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";
import ToasterwithTheme from "@/components/ui/ToasterwithTheme";
import Navbar from "@/components/Navbar";
import LenisScroll from "@/components/LenisScroll";

const montserrat = Montserrat({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindScript AI",
  description: "Generate comprehensive research documents using AI instantly✨🔖",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className}>
        <ThemeProvider attribute="class">
          {children}
          <ToasterwithTheme />
        </ThemeProvider>
      </body>
    </html>
  );
}
