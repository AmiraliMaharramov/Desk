import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickFixDesk – IT & Cihaz Tamir Desteği",
  description:
    "Aylık/Yıllık anlaşma sağlamadan IT veya Cihaz Tamir desteği alın. QuickFixDesk ile hızlı, güvenilir destek.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50 font-sans">{children}</body>
    </html>
  );
}
