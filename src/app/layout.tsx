import type { Metadata } from "next";
import { GeistSans, GeistMono } from 'geist/font'
import "./globals.css";

const geistSans = GeistSans
const geistMono = GeistMono

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
      <body className={geistSans.className}>
        {children}
      </body>
    </html>
  );
}
