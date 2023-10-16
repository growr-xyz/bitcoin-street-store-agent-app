import "@/globals.css";
import type { Metadata } from "next";
import Providers from "@/context/providers";
import { Fredoka } from "next/font/google";

export const metadata: Metadata = {
  title: "Bitcoin Street Store",
  description: "Bitcoin Street Store agent app",
};

const fredoka = Fredoka({
  weight: ["300", "600"],
  subsets: ["latin"],
  variable: "--font-fredoka",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={fredoka.className}>{children}</body>
    </html>
  );
}
