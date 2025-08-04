import type { Metadata } from "next";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Acme Inc.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="dark antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
