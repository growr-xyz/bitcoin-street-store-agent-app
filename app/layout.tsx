import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/context/providers";
import { Ubuntu } from "next/font/google";
import Toast from "@/components/Toast";

export const metadata: Metadata = {
  title: "Bitcoin Street Store",
  description: "Bitcoin Street Store agent app",
};

const ubuntu = Ubuntu({
  weight: ["300", "700"],
  subsets: ["latin"],
  variable: "--font-ubuntu",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={ubuntu.className}>
        <Providers>
          <main>
            {children}
            <Toast />
          </main>
        </Providers>
      </body>
    </html>
  );
}
