import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 老师",
  description: "智能教学助手",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
} 