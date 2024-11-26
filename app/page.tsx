'use client';
import React, { useState, useEffect } from 'react';
import ChatHistory from '../components/ChatHistory';
import ChatFolders from '../components/ChatFolders';
import Login from '../components/Login';
import Register from '../components/Register';
import Settings from '../components/Settings';
import { sendChatMessage } from '../utils/api';
import { loginUser, registerUser, logoutUser, getCurrentUser, saveUserFolders } from '../utils/auth';

interface User {
  id: string;
  username: string;
  folders: Folder[];
}

interface Folder {
  id: number;
  title: string;
  lastUpdate: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolder, setActiveFolder] = useState<Folder | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(false);

  // 检查是否已登录
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // 加载用户数据
  useEffect(() => {
    if (user) {
      setFolders(user.folders);
      setActiveFolder(user.folders[0] || null);
    }
  }, [user]);

  // 保存用户数据
  useEffect(() => {
    if (user) {
      saveUserFolders(user.id, folders);
    }
  }, [folders, user]);

  // 处理主题变化
  useEffect(() => {
    // 检查系统主题偏好
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle('dark', e.matches);
      };
      
      document.documentElement.classList.toggle('dark', mediaQuery.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  const handleLogin = async (username: string, password: string) => {
    const userData = await loginUser(username, password);
    setUser(userData);
  };

  const handleRegister = async (username: string, password: string) => {
    const userData = await registerUser(username, password);
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setFolders([]);
      setActiveFolder(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCreateFolder = () => {
    const newFolder: Folder = {
      id: Date.now(),
      title: '新建对话',
      lastUpdate: new Date().toISOString(),
      messages: []
    };
    setFolders([...folders, newFolder]);
    setActiveFolder(newFolder);
  };

  const handleDeleteFolder = (folderId: number) => {
    if (window.confirm('确定要删除这个文件夹吗？')) {
      const newFolders = folders.filter(f => f.id !== folderId);
      setFolders(newFolders);
      if (activeFolder?.id === folderId) {
        setActiveFolder(newFolders[0] || null);
      }
    }
  };

  const handleRenameFolder = (folderId: number, newTitle: string) => {
    const newFolders = folders.map(folder =>
      folder.id === folderId
        ? { ...folder, title: newTitle }
        : folder
    );
    setFolders(newFolders);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeFolder || isLoading) return;

    // 创建用户消息
    const userMessage = {
      role: 'user' as const,
      content: inputMessage.trim()
    };

    // 更新当前文件夹的消息
    const updatedFolder = {
      ...activeFolder,
      messages: [...activeFolder.messages, userMessage],
      lastUpdate: new Date().toISOString()
    };

    // 更新文件夹列表和当前活动文件夹
    setFolders(prevFolders => 
      prevFolders.map(f => f.id === activeFolder.id ? updatedFolder : f)
    );
    setActiveFolder(updatedFolder);
    setInputMessage(''); // 清空输入框
    setIsLoading(true);

    try {
      // 调用 AI API
      const aiResponse = await sendChatMessage([
        ...updatedFolder.messages.slice(-5), // 只发送最近5条消息作为上下文
        userMessage
      ]);

      // 创建 AI 回复消息
      const aiMessage = {
        role: 'assistant' as const,
        content: aiResponse
      };

      // 再次更新文件夹，添加 AI 回复
      const folderWithAiResponse = {
        ...updatedFolder,
        messages: [...updatedFolder.messages, aiMessage],
        lastUpdate: new Date().toISOString()
      };

      // 更新状态
      setFolders(prevFolders => 
        prevFolders.map(f => f.id === activeFolder.id ? folderWithAiResponse : f)
      );
      setActiveFolder(folderWithAiResponse);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 定义导出函数
  const exportUserData = (userId: string) => {
    const data = {
      userId,
      exportDate: new Date().toISOString(),
      // 如果需要导出更多用户相关数据，可以在这里添加
    };
    return JSON.stringify(data, null, 2);
  };

  const handleExportData = () => {
    if (!user) return;
    const data = exportUserData(user.id);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-data-${user.id}.json`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // 处理数据导入
  const handleImportData = async (file: File) => {
    if (!user) return;
    try {
      await importUserData(user.id, file);
      // 重新加载用户数据
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  };

  // 渲染用户信息和设置按钮
  const renderUserInfo = () => (
    <div className="absolute top-4 right-4 flex items-center space-x-4 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg">
      <Settings
        theme={theme}
        onThemeChange={setTheme}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />
      <span className="text-chat-text">{user?.username}</span>
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm text-chat-accent hover:bg-gray-100 rounded-lg transition-colors"
      >
        登出
      </button>
    </div>
  );

  if (!user) {
    return showRegister ? (
      <Register 
        onRegister={handleRegister}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login 
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <main className="flex h-screen bg-white relative">
      {renderUserInfo()}
      <ChatFolders 
        folders={folders}
        activeFolder={activeFolder}
        onSelectFolder={setActiveFolder}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        onRenameFolder={handleRenameFolder}
      />
      <div className="flex-1 flex flex-col">
        {activeFolder ? (
          <>
            <div className="flex-1 overflow-hidden">
              <ChatHistory 
                messages={activeFolder.messages || []} 
                isLoading={isLoading} 
              />
            </div>
            <div className="p-6 border-t border-gray-200">
              <div className="max-w-4xl mx-auto flex space-x-4">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="输入消息..."
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 text-base rounded-full border border-gray-200
                           focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                           transition-all placeholder:text-gray-400
                           disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className={`px-8 py-3 rounded-full font-medium text-base
                           transition-colors ${
                             isLoading || !inputMessage.trim()
                               ? 'bg-gray-300 cursor-not-allowed'
                               : 'bg-blue-500 text-white hover:bg-blue-600'
                           }`}
                >
                  {isLoading ? '发送中...' : '发送'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="mb-4">点击左侧"+"按钮创建新对话</p>
              <button
                onClick={handleCreateFolder}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                创建新对话
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 