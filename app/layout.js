import './globals.css'

export const metadata = {
  title: 'AI Chat - 智能对话助手',
  description: '下一代 AI 对话平台，让智能对话为您开启无限可能',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body className="antialiased">{children}</body>
    </html>
  )
} 