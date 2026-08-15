import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matrimony Platform",
  description: "A full-stack matrimony connection platform",
  manifest: "/manifest.json",
  themeColor: "#e11d48",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}