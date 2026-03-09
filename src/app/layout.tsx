import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BatchTrack – Inventory & Batch Tracking",
  description: "Mobile-first inventory and batch tracking for small-scale producers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
