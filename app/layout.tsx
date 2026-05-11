import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trail Transit Planner",
  description: "公共交通で行く登山アクセス計画支援アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-950">{children}</body>
    </html>
  );
}
