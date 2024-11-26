import React, { useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatHistoryProps {
  messages: Message[];
  isLoading?: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-wechat-bg">
      {/* 顶部空白区域，为用户信息留出空间 */}
      <div className="h-16"></div>
      
      {/* 消息列表区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full py-4 px-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* 头像 */}
              <div className={`
                w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center
                ${message.role === 'user' 
                  ? 'bg-wechat-user text-white' 
                  : 'bg-white shadow-message'
                }
              `}>
                {message.role === 'user' ? '我' : 'AI'}
              </div>

              {/* 消息气泡 */}
              <div className={`
                relative group max-w-message px-4 py-2.5 rounded-lg
                ${message.role === 'user'
                  ? 'bg-wechat-user text-black'
                  : 'bg-white shadow-message text-black'
                }
              `}>
                {/* 小三角 */}
                <div className={`
                  absolute top-[14px] w-2 h-2 transform rotate-45
                  ${message.role === 'user'
                    ? '-right-1 bg-wechat-user'
                    : '-left-1 bg-white'
                  }
                `} />

                {/* 消息内容 */}
                <div className="relative text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              </div>
            </div>
          ))}

          {/* 加载动画 */}
          {isLoading && (
            <div className="flex items-start gap-2">
              {/* AI头像 */}
              <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center bg-white shadow-message">
                AI
              </div>

              {/* 加载动画气泡 */}
              <div className="relative bg-white shadow-message px-4 py-2.5 rounded-lg">
                {/* 小三角 */}
                <div className="absolute top-[14px] -left-1 w-2 h-2 transform rotate-45 bg-white" />

                {/* 加载动画点 */}
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatHistory; 