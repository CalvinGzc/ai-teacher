'use client'
import { useState } from 'react'
import { PaperAirplaneIcon, PlusIcon } from '@heroicons/react/24/solid'
import useChatStore from '../store/chatStore'

export default function ChatPage() {
  const { 
    conversations, 
    currentConversationId, 
    addMessage, 
    createNewConversation,
    clearCurrentConversation 
  } = useChatStore()
  
  const currentConversation = conversations.find(
    conv => conv.id === currentConversationId
  )
  const messages = currentConversation?.messages || []
  
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const userMessage = { role: 'user', content: input }
    setInput('')
    addMessage(userMessage)
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      })

      if (!response.ok) throw new Error('AI 响应出错了')
      
      const aiMessage = await response.json()
      addMessage(aiMessage)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    createNewConversation()
    setInput('')
    setError(null)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 聊天头部 */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 fixed top-0 w-full z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">AI 助手</h1>
          <button 
            onClick={handleNewChat}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <PlusIcon className="w-5 h-5" />
            新对话
          </button>
        </div>
      </header>

      {/* 聊天消息区域 */}
      <div className="flex-1 overflow-y-auto pt-20 pb-36">
        <div className="max-w-4xl mx-auto px-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-6 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="bg-white text-gray-800 rounded-2xl px-4 py-3 shadow-sm">
                正在思考...
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center mb-6">
              <div className="bg-red-50 text-red-500 rounded-2xl px-4 py-3">
                {error}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 输入区域 */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入您的问题..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-50"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-white rounded-xl px-6 py-3 hover:bg-secondary transition-colors disabled:bg-gray-300"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 