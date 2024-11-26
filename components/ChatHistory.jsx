import React from 'react';

const ChatHistory = ({ messages }) => {
  return (
    <div className="w-full overflow-y-auto max-h-chat">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-4 chat-message ${
            message.role === 'user' 
              ? 'bg-chat-user' 
              : 'bg-chat-assistant'
          }`}
        >
          <div className="w-full">
            <p className="text-sm font-semibold mb-2">
              {message.role === 'user' ? '用户' : 'AI助手'}
            </p>
            <div className="whitespace-pre-wrap">
              {message.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory; 