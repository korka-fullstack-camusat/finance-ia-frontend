import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "FinanceAI",
  description: "Plateforme Finance pilotée par IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="bg-[#F8FAFC] text-[#0F172A] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
