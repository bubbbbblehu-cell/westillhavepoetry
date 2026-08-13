import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "诗雨 · 接住一首诗",
  description: "在一场不会下完的诗雨里，接住刚好落向你的那一句。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
