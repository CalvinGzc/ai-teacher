/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'wechat': {
          'bg': '#F4F4F4',
          'user': '#95EC69',
          'assistant': '#FFFFFF',
          'border': '#E6E6E6',
        },
        'chat': {
          'text': '#1d1d1f',
          'label': '#86868b',
          'accent': '#0071e3',  // 登录按钮颜色
          'hover': '#0077ED',   // 按钮悬停颜色
          'border': '#d2d2d7'
        }
      },
      maxWidth: {
        'message': '70%',
      },
      boxShadow: {
        'message': '0 1px 2px rgba(0, 0, 0, 0.1)',
        'apple': '0 2px 5px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
} 