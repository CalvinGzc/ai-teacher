'use client';
import React, { useState } from 'react';
import ChatHistory from '../components/ChatHistory';
import ChatFolders from '../components/ChatFolders';

export default function Home() {
  const [folders, setFolders] = useState([
    {
      id: 1,
      title: '关于JavaScript的讨论',
      lastUpdate: '2024-03-20',
      messages: [
        { role: 'user', content: '什么是闭包？' },
        { role: 'assistant', content: '闭包是指一个函数可以访问其外部作用域中的变量...' },
      ]
    },
    {
      id: 2,
      title: 'React学习笔记',
      lastUpdate: '2024-03-21',
      messages: [
        { role: 'user', content: '如何使用useState？' },
        { role: 'assistant', content: 'useState是React的一个Hook...' },
      ]
    },
    {
      id: 3,
      title: 'Python基础教程',
      lastUpdate: '2024-03-19',
      messages: [
        { role: 'user', content: 'Python中的列表和元组有什么区别？' },
        { role: 'assistant', content: '列表是可变的，而元组是不可变的...' },
      ]
    },
    {
      id: 4,
      title: 'AI模型训练',
      lastUpdate: '2024-03-22',
      messages: [
        { role: 'user', content: '什么是过拟合？' },
        { role: 'assistant', content: '过拟合是指模型在训练数据上表现很好，但在新数据上表现差...' },
      ]
    },
    {
      id: 5,
      title: '数据库优化',
      lastUpdate: '2024-03-18',
      messages: [
        { role: 'user', content: '如何优化MySQL查询性能？' },
        { role: 'assistant', content: '可以通过建立索引、优化查询语句、调整配置参数等方式...' },
      ]
    }
  ]);

  const [activeFolder, setActiveFolder] = useState(folders[0]);

  const handleCreateFolder = () => {
    const newFolder = {
      id: Date.now(),
      title: '新建文件夹',
      lastUpdate: new Date().toISOString(),
      messages: []
    };
    setFolders([...folders, newFolder]);
    setActiveFolder(newFolder);
  };

  const handleDeleteFolder = (folderId) => {
    if (window.confirm('确定要删除这个文件夹吗？')) {
      const newFolders = folders.filter(f => f.id !== folderId);
      setFolders(newFolders);
      if (activeFolder.id === folderId) {
        setActiveFolder(newFolders[0] || null);
      }
    }
  };

  const handleRenameFolder = (folderId, newTitle) => {
    const newFolders = folders.map(folder =>
      folder.id === folderId
        ? { ...folder, title: newTitle }
        : folder
    );
    setFolders(newFolders);
  };

  return (
    <main className="flex h-screen">
      <ChatFolders 
        folders={folders}
        activeFolder={activeFolder}
        onSelectFolder={setActiveFolder}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        onRenameFolder={handleRenameFolder}
      />
      <div className="flex-1 flex flex-col">
        <ChatHistory messages={activeFolder?.messages || []} />
      </div>
    </main>
  );
} 