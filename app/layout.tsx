import type { Metadata } from 'next'
import { GeistSans, GeistMono } from 'geist/font'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Teacher',
  description: 'Your AI Teaching Assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={GeistSans.className}>
        {children}
      </body>
    </html>
  )
} 